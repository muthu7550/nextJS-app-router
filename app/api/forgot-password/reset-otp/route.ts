import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/db";
import register from "../../../model/register";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, otp, password } = await request.json();

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: "Email, OTP and password are required" },
        { status: 400 }
      );
    }

    const user = await register.findOne({
      email: email.toLowerCase().trim(),
      resetOtp: otp,
      resetOtpExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Password reset failed" },
      { status: 500 }
    );
  }
}