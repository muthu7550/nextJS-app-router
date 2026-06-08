import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Users from "@/app/model/user";
import path from "path";
import fs from "fs/promises";
import cloudinary from "@/app/lib/cloudinary";

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
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "products",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            )
            .end(buffer);
        }
      );

      imagePath = result.secure_url;
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