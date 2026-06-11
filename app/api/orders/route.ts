import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../lib/db";
import Order from "../../model/Order";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const utrNumber = body.payment?.utrNumber;
    if (!utrNumber) {
      return NextResponse.json(
        { error: "UTR number is required" },
        { status: 400 }
      );
    }

    if (!body.address?.street || !body.address?.city || !body.address?.pincode) {
      return NextResponse.json(
        { error: "Full address is required" },
        { status: 400 }
      );
    }

    const existingOrder = await Order.findOne({
      "payment.utrNumber": utrNumber,
    });

    if (existingOrder) {
      return NextResponse.json(
        { error: "This UTR number already exists" },
        { status: 409 }
      );
    }

    const order = await Order.create({
      products: body.products,
      payment: {
        method: body.payment.method,
        upiId: body.payment.upiId,
        phone: body.payment.phone,
        status: body.payment.status || "Processing",
        utrNumber,
      },
      address: {
        street: body.address.street,
        city: body.address.city,
        pincode: body.address.pincode,
      },
      totalAmount: body.totalAmount,
      orderStatus: body.orderStatus || "Processing",
    });

    return NextResponse.json(
      {
        message: "Order stored successfully",
        data: order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "This UTR number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Order creation failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Orders fetch failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Order id is required" },
        { status: 400 }
      );
    }

    await Order.findByIdAndDelete(body.id);

    return NextResponse.json({
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Order delete failed" },
      { status: 500 }
    );
  }
}