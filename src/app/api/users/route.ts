import { connectToDB } from "@/lib/mongodb";
import User, { IUser } from "@/models/userModel";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const GET = async (req: Request) => {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const nextRequest = req as unknown as NextRequest;
        const token = await getToken({ req: nextRequest, secret });

        if (!token) {
            const loginUrl = new URL('/not-found', req.url);
            return NextResponse.redirect(loginUrl);
        }

        await connectToDB();

        const users: IUser[] = await User.find()
            .populate({
                path: "orders",
                select: "address totalPrice status orderNumber deliveryDate createdAt items",
                populate: {
                    path: "items.product",
                    select: "name category mainImage price stock inStock",
                },
            });

        if (!users) {
            throw new Error("All Users Fetching Fail from MongoDB...");
        }

        return NextResponse.json(users, { status: 200 });
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