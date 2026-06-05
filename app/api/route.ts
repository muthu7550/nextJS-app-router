// // app/api/items/route.js
// import { NextResponse } from 'next/server';
// import dbConnect from '../lib/db';
// import Users from '../model/user'; // Adjust the path to your user model

// // Handle GET requests
// export async function GET() {
//   await dbConnect();
//   const data = { message: "Fetching all items" };
//   console.log("GET request received, fetching items...");
//   const res= await Users.find();
//   console.log("Data fetched from database:", res); 
//   return NextResponse.json(res);
// }

// export async function POST(request: any) {
//   await dbConnect();
//   const body = await request.json(); 
  
//   // Save the user to the database
//   console.log("POST request received with body:", body); 
//   const newUser = await Users.create(body); 
//   console.log("New user created:", newUser); 

//   return NextResponse.json(
//     { message: "User created", data: newUser }, 
//     { status: 201 }
//   );
  
// }

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../lib/db';
import Users from '../model/user';

// Handle GET requests
export async function GET() {
  try {
    await dbConnect();
    
    const res = await Users.find();
    console.log("Data fetched from database:", res); 
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// // Handle POST requests
// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();
//     const body = await request.json(); 
    
//     console.log("POST request received with body:", body); 
//     const newUser = await Users.create(body); 
//     console.log("New user created:", newUser); 

//     return NextResponse.json(
//       { message: "User created", data: newUser }, 
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
//   }
// }



// import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
// import dbConnect from "@/lib/dbConnect";
// import Users from "@/models/User"; // Ensure this matches your model name

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // 1. Get data from FormData
    const formData = await request.formData();
    console.log(formData,"fdata")
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    console.log(price)
    const file = formData.get("image") as File | null;
    const userId = formData.get("userId"); 
    console.log(userId,"uido")


    let imagePath = "";

    // 2. Process Image if it exists
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + "_" + file.name.replace(/\s+/g, "_");
      
      // We save to 'public/uploads' so it's accessible via URL
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      
      imagePath = `/uploads/${filename}`;
    }

    // 3. Create the document in MongoDB
    const newUser = await Users.create({
      name,
      description,
      price,
      image: imagePath,
      itemCount : 0,
      userName: "John Doe",
      userId
    });

    console.log("New user/product created:", newUser);

    return NextResponse.json(
      { message: "Created successfully", data: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 400 }
    );
  }
}


 