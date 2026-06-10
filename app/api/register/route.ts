import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../lib/db";
import register from "../../model/register";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  try {

    // 1. DB CONNECT
    await dbConnect();

    // 2. BODY
    const body = await request.json();

    const { email, password, name } = body;

    // 3. VALIDATION
    if (!email || !password) {

      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await register.findOne({
      email: normalizedEmail,
    });


    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // 5. HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. CREATE USER

    const newUser = await register.create({
      email: normalizedEmail,
      password: hashedPassword,
      name,
    });


    // 7. ENV CHECK
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing in environment variables");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // 8. JWT

    const token = await new SignJWT({
      userId: newUser._id.toString(),
      email: newUser.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);


    // 9. RESPONSE
    return NextResponse.json(
      {
        message: "Created successfully",
        token,
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("========== REGISTER ERROR ==========");
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("Full Error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to create entry",
      },
      { status: 500 }
    );
  }
}