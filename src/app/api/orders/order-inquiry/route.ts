import { connectToDB } from '@/lib/mongodb';
import Order from '@/models/orderModel';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const { orderNumber } = await req.json(); 

        if (!orderNumber) {
            return NextResponse.json({ message: 'Order number is required' }, { status: 400 });
        }

        await connectToDB();

        const order = await Order.findOne({ orderNumber });

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(
            { status: order.status, deliveryDate: order.deliveryDate }, 
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Failed to retrieve order status', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
};
