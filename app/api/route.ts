import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Users from "@/app/model/user";
import path from "path";
import fs from "fs/promises";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    await dbConnect();

    const users = await Users.find();

    return NextResponse.json(users, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const userId = formData.get("userId");
    const file = formData.get("image") as File | null;

    let imagePath = "";

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const filename =
        Date.now() + "_" + file.name.replace(/\s+/g, "_");

      const uploadDir = path.join(
        process.cwd(),
        "public/uploads"
      );

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);

      imagePath = `/uploads/${filename}`;
    }

    const newUser = await Users.create({
      name,
      description,
      price,
      image: imagePath,
      itemCount: 0,
      userName: "John Doe",
      userId,
    });

    return NextResponse.json(
      {
        message: "Created successfully",
        data: newUser,
      },
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}