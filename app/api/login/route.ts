import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../lib/db";
import register from "../../model/register";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  try {
    console.log("=== LOGIN API START ===");

    // 1. DB CONNECT
    console.log("Connecting DB...");
    await dbConnect();
    console.log("DB Connected");

    // 2. READ BODY
    const body = await request.json();
    console.log("Request Body:", body);

    const { email, password } = body;

    // 3. VALIDATION
    if (!email || !password) {
      console.log("Validation failed: missing email/password");

      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 4. FIND USER
    console.log("Searching user:", email);

    const user = await register.findOne({ email });

    console.log("User Found:", user ? "YES" : "NO");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5. PASSWORD CHECK
    if (!user.password) {
      console.log("User password missing in DB");

      return NextResponse.json(
        { error: "User password missing in DB" },
        { status: 500 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("Password Valid:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // // 6. ENV CHECK
    // if (!process.env.JWT_SECRET) {
    //   console.log("JWT_SECRET missing in env");

    //   throw new Error("JWT_SECRET is not defined");
    // }

    const secret = new TextEncoder().encode("your_super_secret_random_string_here_at_least_32_characters");

    // 7. CREATE TOKEN
    console.log("Creating JWT...");

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);

    console.log("JWT Created");

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