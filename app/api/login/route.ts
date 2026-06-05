import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/db';
import register from '../../model/register';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();
    console.log(email)
    console.log(password)


    // 1. Check if user exists (Added .lean() to get raw, clean data)
    const user = await register.findOne({ email })
    console.log(user)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Create JWT Token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const token = await new SignJWT({ userId: user._id.toString(), email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);

    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name }
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
