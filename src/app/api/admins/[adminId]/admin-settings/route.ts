import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt';
import Admin, { IAdmin } from '@/models/adminModel';

export const PATCH = async (req: NextRequest, { params }: { params: { adminId: string } }) => {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized: No token provided.' }, { status: 401 });
        }

        const { adminId } = params;
        if (token.id !== adminId) {
            return NextResponse.json({ message: 'Forbidden: You can only update your own account.' }, { status: 403 });
        }

        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ message: "Name, and email are required." }, { status: 400 });
        }

        await connectToDB();

        const updatedAdmin: IAdmin | null = await Admin.findByIdAndUpdate(
            adminId,
            { name, email },
            { new: true, runValidators: true }
        );

        if (!updatedAdmin) {
            return NextResponse.json({ message: "Admin update failed." }, { status: 404 });
        }

        return NextResponse.json(updatedAdmin, { status: 200 });
    } catch (error) {
        console.error('Error updating admin info:', error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
};