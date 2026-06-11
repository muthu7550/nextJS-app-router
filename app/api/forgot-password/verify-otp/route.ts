import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import register from "../../../model/register";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
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

    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("VERIFY OTP ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "OTP verification failed" },
      { status: 500 }
    );
  }
}