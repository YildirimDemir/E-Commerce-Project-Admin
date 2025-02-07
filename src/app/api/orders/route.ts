import { connectToDB } from "@/lib/mongodb";
import Order, { IOrder } from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { generateOrderNumber } from '@/lib/orderUtils';
import User from "@/models/userModel";
import Product from "@/models/productModel";

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { searchParams } = req.nextUrl;
        const search = searchParams.get('search');
        const sort = searchParams.get('sort');
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

        const filters: any = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filters.$or = [
                { orderNumber: searchRegex },
                { status: searchRegex }
            ];
        }

        let query = Order.find(filters)
            .populate("user", "name email")
            .populate({
                path: "items.product",
                select: "name price category mainImage stock brand",
            });
        if (sort) {
            const direction = sort.startsWith('-') ? -1 : 1;
            const field = sort.replace('-', '');
            query = query.sort({ [field]: direction });
        } else {
            query = query.sort({ createdAt: -1 });
        }
        if (limit) {
            query = query.limit(limit);
        }

        const orders = await query;

        const formattedOrders = orders.map(order => ({
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
        }));

        return NextResponse.json(formattedOrders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch orders', details: error instanceof Error ? error.message : '' }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req, secret });

        if (!token) {
            return NextResponse.json({ message: "Authentication required" }, { status: 401 });
        }

        const { user, address, totalPrice, items } = await req.json();
        if (
            !user ||
            !address ||
            typeof address.fullName !== "string" ||
            typeof address.addressLine !== "string" ||
            typeof address.city !== "string" ||
            typeof address.state !== "string" ||
            typeof address.country !== "string" ||
            typeof address.zipPostalCode !== "string" ||
            !totalPrice ||
            !items ||
            !Array.isArray(items)
        ) {
            return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
        }

        await connectToDB();

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3); 

        const orderNumber = generateOrderNumber();

        const newOrder = new Order({
            orderNumber,
            user,
            address,
            totalPrice,
            items,
            status: "pending",
            deliveryDate,
        });

        const savedOrder = await newOrder.save();
        await User.findByIdAndUpdate(user, { $push: { orders: savedOrder._id } });
        const stockUpdatePromises = items.map(async (item: { product: string; quantity: number }) => {
            const product = await Product.findById(item.product);

            if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(
                    `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
                );
            }
            product.stock -= item.quantity;
            await product.save();
        });
        await Promise.all(stockUpdatePromises);

        return NextResponse.json(savedOrder, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Failed to create order', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
};
