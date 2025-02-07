import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt';
import mongoose from 'mongoose';
import Product from '@/models/productModel';

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
      const { productId } = params;
  
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'Invalid product ID format.' },
          { status: 400 }
        );
      }
  
      await connectToDB();
      const product = await Product.findById(productId)
  
      if (!product) {
        return NextResponse.json(
          { error: 'Not Found', message: 'Product not found.' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(product, { status: 200 });
    } catch (error) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Failed to fetch product.',
          details: error instanceof Error ? error.message : 'Unknown error occurred.',
        },
        { status: 500 }
      );
    }
};

export const PATCH = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req, secret });

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Please log in.' },
                { status: 401 }
            );
        }

        const { productId } = params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json(
              { error: 'Bad Request', message: 'Invalid product ID format.' },
              { status: 400 }
            );
        }

        const {
            name,
            category,
            price,
            sizes,
            color,
            brand,
            mainImage,
            images,
            inStock,
            stockCount
        } = await req.json();

        if (!name && !category && !price && !sizes && !color && !brand && !mainImage && !images && inStock === undefined && stockCount === undefined) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'At least one field is required to update.' },
                { status: 400 }
            );
        }

        await connectToDB();

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Not Found', message: 'Product not found.' },
                { status: 404 }
            );
        }

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.sizes = sizes || product.sizes;
        product.color = color || product.color;
        product.brand = brand || product.brand;
        product.mainImage = mainImage || product.mainImage;
        product.images = images || product.images;
        product.inStock = inStock !== undefined ? inStock : product.inStock;
        product.stock = stockCount || product.stock;

        await product.save();

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: 'Failed to update product.',
                details: error instanceof Error ? error.message : 'Unknown error occurred.',
            },
            { status: 500 }
        );
    }
};


export const DELETE = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
      const secret = process.env.NEXTAUTH_SECRET;
      const token = await getToken({ req, secret });
  
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Please log in.' },
          { status: 401 }
        );
      }
  
      const { productId } = params;
  
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'Invalid product ID format.' },
          { status: 400 }
        );
      }
  
      await connectToDB();
      const product = await Product.findById(productId);
  
      if (!product) {
        return NextResponse.json(
          { error: 'Not Found', message: 'Product not found.' },
          { status: 404 }
        );
      }
  
      await Product.findByIdAndDelete(productId);
  
      return NextResponse.json(
        { message: 'Product deleted successfully.' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Failed to delete product.',
          details: error instanceof Error ? error.message : 'Unknown error occurred.',
        },
        { status: 500 }
      );
    }
  };