import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    payment: {
      method: String,
      upiId: String,
      phone: String,
      status: String,
      utrNumber: {
        type: String,
        required: true,
        unique: true,
      },
    },

    address: {
      street: String,
      city: String,
      pincode: String,
    },

    totalAmount: Number,

    orderStatus: {
      type: String,
      default: "Processing",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);