import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../lib/db";
import Users from "../../model/user";
import path from "path";
import fs from "fs/promises";

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

    // ⚠️ VERCEL ISSUE: filesystem is NOT persistent
    if (file && file.size > 0) {
      console.log("File received:", file.name);

      const buffer = Buffer.from(await file.arrayBuffer());

      const filename =
        Date.now() + "_" + file.name.replace(/\s+/g, "_");

      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await fs.mkdir(uploadDir, { recursive: true });

      await fs.writeFile(path.join(uploadDir, filename), buffer);

      imagePath = `/uploads/${filename}`;

      console.log("File saved:", imagePath);
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
    console.error("PUT Error:", error?.message, error?.stack);

    return NextResponse.json(
      { error: error?.message || "Failed to update user" },
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