import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Users from "@/app/model/user";
import path from "path";
import fs from "fs/promises";

export async function GET() {
  try {
    console.log("GET USERS API START");

    await dbConnect();

    const res = await Users.find();

    console.log("Users fetched:", res.length);

    return NextResponse.json(res);
  } catch (error: any) {
    console.error("GET Error:", error?.message, error?.stack);

    return NextResponse.json(
      { error: error?.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST API START");

    await dbConnect();

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const userId = formData.get("userId");
    const file = formData.get("image") as File | null;

    console.log("Form Data:", { name, price, userId });

    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    let imagePath = "";

    // 🚨 VERCEL FIX: DO NOT SAVE FILE LOCALLY
    if (file && file.size > 0) {
      console.log("File received:", file.name);

      const buffer = Buffer.from(await file.arrayBuffer());

      const filename =
        Date.now() + "_" + file.name.replace(/\s+/g, "_");

      const uploadDir = path.join(process.cwd(), "public/uploads");

      console.log("Upload path:", uploadDir);

      await fs.mkdir(uploadDir, { recursive: true });

      await fs.writeFile(path.join(uploadDir, filename), buffer);

      imagePath = `/uploads/${filename}`;

      console.log("File saved:", imagePath);
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

    console.log("Document created:", newUser._id);

    return NextResponse.json(
      { message: "Created successfully", data: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("========== POST ERROR ==========");
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);

    return NextResponse.json(
      { error: error?.message || "Failed to create entry" },
      { status: 500 }
    );
  }
}