import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../lib/db";
import Users from "../../model/user";
import path from "path";
import fs from "fs/promises";
import cloudinary from "../../lib/cloudinary";

// ======================
// GET USER
// ======================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("GET USER START");

    await dbConnect();

    const { id } = params;
    console.log("User ID:", id);

    const user = await Users.findById(id);

    console.log("User found:", !!user);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("GET Error:", error?.message, error?.stack);

    return NextResponse.json(
      { error: error?.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// ======================
// UPDATE USER
// ======================


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("PUT USER START");

    await dbConnect();

    const { id } = params;
    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const itemCount = formData.get("itemCount");
    const file = formData.get("image") as File | null;
    const existingImage = formData.get("existingImage");

    console.log("Incoming data:", {
      id,
      name,
      price,
      itemCount,
    });

    let imagePath = (existingImage as string) || "";

    // ✅ CLOUDINARY UPLOAD (instead of local storage)
    if (file && file.size > 0) {
      console.log("New image received:", file.name);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
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
      });

      imagePath = result.secure_url;

      console.log("Cloudinary image URL:", imagePath);
    }

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        itemCount,
        image: imagePath,
      },
      { new: true }
    );

    console.log("Updated user:", !!updatedUser);

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("PUT Error:", error?.message);

    return NextResponse.json(
      {
        error: error?.message || "Failed to update user",
      },
      { status: 500 }
    );
  }
}

// ======================
// DELETE USER
// ======================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("DELETE USER START");

    await dbConnect();

    const { id } = params;

    const deletedUser = await Users.findByIdAndDelete(id);

    console.log("Deleted:", !!deletedUser);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error: any) {
    console.error("DELETE Error:", error?.message, error?.stack);

    return NextResponse.json(
      { error: error?.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}