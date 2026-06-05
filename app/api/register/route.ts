import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../lib/db";
import register from "../../model/register";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const { email, password, name } = body;

    // ======================
    // 1. VALIDATION
    // ======================
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ======================
    // 2. CHECK EXISTING USER
    // ======================
    const existingUser = await register.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // ======================
    // 3. HASH PASSWORD (SAFE)
    // ======================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ======================
    // 4. CREATE USER
    // ======================
    const newUser = await register.create({
      email: normalizedEmail,
      password: hashedPassword,
      name,
    });

    // ======================
    // 5. JWT CHECK (IMPORTANT)
    // ======================
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing in environment variables");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      userId: newUser._id.toString(),
      email: newUser.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);

    // ======================
    // 6. RESPONSE
    // ======================
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
  } catch (error) {
    console.error("POST Error:", error);

    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}