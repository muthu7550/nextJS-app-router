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
    await dbConnect();

    const { id } = params;

    const user = await Users.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch user" },
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
    await dbConnect();

    const { id } = params;

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const itemCount = formData.get("itemCount");

    const file = formData.get("image") as File | null;
    const existingImage = formData.get("existingImage");

    let imagePath = (existingImage as string) || "";

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const filename =
        Date.now() + "_" + file.name.replace(/\s+/g, "_");

      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await fs.mkdir(uploadDir, { recursive: true });

      await fs.writeFile(path.join(uploadDir, filename), buffer);

      imagePath = `/uploads/${filename}`;
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
  } catch (error) {
    console.error("PUT Error:", error);

    return NextResponse.json(
      { error: "Failed to update user" },
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
    await dbConnect();

    const { id } = params;

    const deletedUser = await Users.findByIdAndDelete(id);

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
  } catch (error) {
    console.error("DELETE Error:", error);

    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}