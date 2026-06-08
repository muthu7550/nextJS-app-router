import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "nextjs_uploads",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return Response.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}