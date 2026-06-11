    import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "../../../lib/db";
import register from "../../../model/register";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await register.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Email not registered" },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mec.marimuthu.it@gmail.com",
        pass: "sryv kctd gkoy razb",
      },
    });

    await transporter.sendMail({
      from: "mec.marimuthu.it@gmail.com",
      to: normalizedEmail,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}