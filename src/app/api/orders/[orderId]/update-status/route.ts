import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

export const PATCH = async (req: NextRequest, { params }: { params: { orderId: string } }) => {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req, secret });

        if (!token) {
            return NextResponse.json({ message: "Authentication required" }, { status: 401 });
        }

        const { orderId } = params;

        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return NextResponse.json({ message: "Invalid order ID" }, { status: 400 });
        }

        const body = await req.json();
        const { status } = body;

        const validStatuses = ["pending", "delivered", "canceled", "shipped", "processing"];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
        }

        await connectToDB();

        let updateFields: any = { status };

        if (status === "delivered") {
            const deliveryDate = new Date();
            updateFields.deliveryDate = deliveryDate; 
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateFields,
            { new: true }
        ).populate("user", "name email").populate("items.product", "name price category");

        if (!updatedOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Order status updated successfully", order: updatedOrder }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Failed to update order status", details: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "An unknown error occurred" }, { status: 500 });
    }
};