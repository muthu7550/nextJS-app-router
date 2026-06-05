import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/db';
import register from '../../model/register';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose'; // 👈 Import SignJWT

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await register.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // 2. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // 3. Save to database with hashed password
    const newUser = await register.create({
      ...body,
      password: hashedPassword
    });

    // 4. Create JWT Token (Matches your login implementation)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const token = await new SignJWT({ userId: newUser._id.toString(), email: newUser.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);

    // 5. Return success message, token, and user details
    return NextResponse.json({
      message: "Created successfully",
      token,
      user: { id: newUser._id.toString(), email: newUser.email, name: newUser.name }
    }, { status: 201 });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}
