import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/authBcrypt';
import { connectToDB } from '@/lib/mongodb';
import Admin, { IAdmin } from '@/models/adminModel';
import { getToken } from 'next-auth/jwt';

export const GET = async (req: Request) => {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const nextRequest = req as unknown as NextRequest;
        const token = await getToken({ req: nextRequest, secret });

        if (!token || token.role !== 'admin') {
            const loginUrl = new URL('/not-found', req.url);
            return NextResponse.redirect(loginUrl);
        }

        await connectToDB();

        const admins: IAdmin[] = await Admin.find()

        if (!admins) {
            throw new Error("All Admins Fetching Fail from MongoDB...");
        }

        return NextResponse.json(admins, { status: 200 });
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

export const POST = async (req: NextRequest) => {
    try {
        const {name, email, password, passwordConfirm } = await req.json(); 

        if ( !name || !email || !email.includes("@") || !password || password.trim().length < 7) {
            return NextResponse.json({ message: "Invalid input." }, { status: 422 });
        }

        await connectToDB();
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json({ message: "Admin exists already!" }, { status: 422 });
        }

        if (password !== passwordConfirm) {
            return NextResponse.json({ message: "Passwords are not the same!" }, { status: 422 });
        }

        const hashedPassword = await hashPassword(password);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();

        return NextResponse.json({ message: "Admin Created" }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating admin:', error.message);
            return NextResponse.json({ message: 'Failed to create admin', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ message: 'Failed to create admin', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
};
