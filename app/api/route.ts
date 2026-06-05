import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Users from "@/app/model/user";
import path from "path";
import fs from "fs/promises";

// ======================
// GET ALL USERS
// ======================
export async function GET() {
  try {
    await dbConnect();

    const res = await Users.find();

    return NextResponse.json(res);
  } catch (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ======================
// CREATE USER / ITEM
// ======================
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const userId = formData.get("userId");
    const file = formData.get("image") as File | null;

    // ======================
    // VALIDATION
    // ======================
    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    let imagePath = "";

    // ======================
    // FILE HANDLING WARNING
    // ======================
    // NOTE: Vercel does NOT persist local uploads.
    // This only works in dev environment.
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const filename =
        Date.now() + "_" + file.name.replace(/\s+/g, "_");

      const uploadDir = path.join(process.cwd(), "public/uploads");

      await fs.mkdir(uploadDir, { recursive: true });

      await fs.writeFile(path.join(uploadDir, filename), buffer);

      imagePath = `/uploads/${filename}`;
    }

    // ======================
    // CREATE DOCUMENT
    // ======================
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
      { message: "Created successfully", data: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);

    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}