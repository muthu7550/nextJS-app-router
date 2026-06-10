import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../lib/db";
import register from "../../model/register";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  try {

    // 1. DB CONNECT
    await dbConnect();

    // 2. READ BODY
    const body = await request.json();

    const { email, password } = body;

    // 3. VALIDATION
    if (!email || !password) {

      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 4. FIND USER

    const user = await register.findOne({ email });


    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5. PASSWORD CHECK
    if (!user.password) {

      return NextResponse.json(
        { error: "User password missing in DB" },
        { status: 500 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode("your_super_secret_random_string_here_at_least_32_characters");

    // 7. CREATE TOKEN

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);


    // 8. RESPONSE
    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("========== LOGIN ERROR =========="); 
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("Full Error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}