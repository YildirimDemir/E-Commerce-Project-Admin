import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import Admin, { IAdmin } from '@/models/adminModel';

export const GET = async (req: NextRequest, { params }: { params: { adminId: string } }) => {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req, secret });

        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: "Authentication required" }, { status: 401 });
        }

        const { adminId } = params;

        if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
            return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
        }

        await connectToDB();
        const admin: IAdmin | null = await Admin.findById(adminId)

        if (!admin) {
            return NextResponse.json({ message: "Admin not found on ID..." }, { status: 404 });
        }

        return NextResponse.json(admin, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Failed to fetch Admin', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { adminId: string } }) => {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req, secret });

        if (!token) {
            return NextResponse.json({ message: "Only auth admin can delete admins" }, { status: 403 });
        }

        const { adminId } = params;

        if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
            return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
        }

        await connectToDB();
        const deletedAdmin = await Admin.findById(adminId);

        if (!deletedAdmin) {
            return NextResponse.json({ message: "Admin not found on ID..." }, { status: 404 });
        }
        
        await Admin.findByIdAndDelete(adminId);

        return NextResponse.json({ message: "Admin deleted successfully" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Failed to delete admin', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
};

