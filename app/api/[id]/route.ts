// // import { NextResponse } from 'next/server';

// // import dbConnect from '../../lib/db';
// // import Users from '../../model/user'; // Adjust the path to your user model
// // // Handle GET requests

// // export async function GET(request, { params }) {
// //   await dbConnect();
// //    const { id } = await params;
// //   console.log("GET request received for ID:", id); 
// //   const res = await Users.findById(id);
// //   console.log("Data fetched from database:", res);
// //   return NextResponse.json(res);
// // }



// // export async function PUT(request, { params }) {
// //     await dbConnect();
// //     const { id } = await params;
// //     const body = await request.json();
// //     console.log("PUT request received for ID:", id, "with body:", body); 


// //     const updatedUser = await Users.findByIdAndUpdate(id, body, { new: true });
// //     if (!updatedUser) {
// //         return NextResponse.json({ message: "User not found" }, { status: 404 });
// //     }

// //     return NextResponse.json({ message: "User updated", data: updatedUser });
// // }

// // export async function DELETE(request, { params }) {
// //     await dbConnect();
// //     const { id } = await params;
// //     console.log("DELETE request received for ID:", id);
// //     const deletedUser = await Users.findByIdAndDelete(id);
// //     if (!deletedUser) {
// //         return NextResponse.json({ message: "User not found" }, { status: 404 });
// //     }
// //     return NextResponse.json({ message: "User deleted", data: deletedUser });
// // }   


// import { NextResponse } from 'next/server';

// import dbConnect from '../../lib/db';
// import Users from '../../model/user';

// export async function GET(request, { params }) {
//   await dbConnect();

//   const { id } = await params;

//   const res = await Users.findById(id);

//   return NextResponse.json(res);
// }

// export async function PUT(request, { params }) {
//   await dbConnect();

//   const { id } = await params;
//   const body = await request.json();

//   const updatedUser = await Users.findByIdAndUpdate(id, body, {
//     new: true,
//   });

//   if (!updatedUser) {
//     return NextResponse.json(
//       { message: "User not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json({
//     message: "User updated",
//     data: updatedUser,
//   });
// }

// export async function DELETE(request, { params }) {
//   await dbConnect();

//   const { id } = await params;

//   const deletedUser = await Users.findByIdAndDelete(id);
//   console.log("Deleted user:", deletedUser); 

//   if (!deletedUser) {
//     return NextResponse.json(
//       { message: "User not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json({
//     message: "User deleted",
//     data: deletedUser,
//   });
// }

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

    const { id } = await params;

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

    const { id } = await params;

    // Parse FormData
    const formData = await request.formData();

    // Get fields
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const itemCount = formData.get("itemCount");

    const file = formData.get("image") as File | null;
    const existingImage = formData.get("existingImage");

    // Default image path
    let imagePath = existingImage as string;

    // Upload new image if exists
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const filename =
        Date.now() + "_" + file.name.replace(/\s+/g, "_");

      const uploadDir = path.join(
        process.cwd(),
        "public/uploads"
      );

      // Create folder if not exists
      await fs.mkdir(uploadDir, { recursive: true });

      // Save file
      await fs.writeFile(
        path.join(uploadDir, filename),
        buffer
      );

      imagePath = `/uploads/${filename}`;
    }

    // Update database
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

    const { id } = await  params;

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