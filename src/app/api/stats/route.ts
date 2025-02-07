import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";
import User from "@/models/userModel";
import Admin from "@/models/adminModel"; 
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectToDB();

    const [productsCount, usersCount, ordersCount, totalIncome, adminsCount] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]), 
      Admin.countDocuments(), 
    ]);

    return NextResponse.json(
      {
        productsCount,
        usersCount,
        ordersCount,
        totalIncome: totalIncome[0]?.total || 0, 
        adminsCount,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred." },
      { status: 500 }
    );
  }
};