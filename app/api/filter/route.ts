import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../lib/db";
import Product from "../../model/user";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const page = Number(body.page) || 1;
    const limit = Number(body.limit) || 8;
    const skip = (page - 1) * limit;

    const minprice = body.minprice;
    const maxprice = body.maxprice;
    const search = body.search;

    const query: any = {};

    if (minprice || maxprice) {
      query.price = {};

      if (minprice) {
        query.price.$gte = Number(minprice);
      }

      if (maxprice) {
        query.price.$lte = Number(maxprice);
      }
    }

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    const [products, totalItems] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}