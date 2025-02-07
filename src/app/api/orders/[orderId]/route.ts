import { connectToDB } from "@/lib/mongodb";
import Order, { IOrder } from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

export const GET = async (req: NextRequest, { params }: { params: { orderId: string } }) => {
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

        await connectToDB();
        const order: IOrder | null = await Order.findById(orderId)
            .populate("user", "name email") 
            .populate({
                path: "items.product", 
                select: "name price category mainImage stock brand", 
            });

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        const formattedOrder = {
            ...order.toObject(),
            address: {
                fullName: order.address.fullName,
                addressLine: order.address.addressLine,
                apartment: order.address.apartment || '',
                city: order.address.city,
                state: order.address.state,
                country: order.address.country,
                zipPostalCode: order.address.zipPostalCode,
            },
        };

        return NextResponse.json(formattedOrder, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Failed to fetch order', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
};


export const DELETE = async (req: NextRequest, { params }: { params: { orderId: string } }) => {
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

        await connectToDB();
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return NextResponse.json({ message: "Order not found or already deleted" }, { status: 404 });
        }

        return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Failed to delete order', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
};
