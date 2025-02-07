import { connectToDB } from '@/lib/mongodb';
import Product from '@/models/productModel'
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const brand = searchParams.get('brand');
    const color = searchParams.get('color');
    const sizes = searchParams.get('sizes');
    const gender = searchParams.get('gender');

    const filters: any = {};

    if (search) {
      const searchTerms = search.split(' ').map(term => term.trim());
      filters.$or = [
        { name: { $regex: searchTerms.join('|'), $options: 'i' } },
        { brand: { $regex: searchTerms.join('|'), $options: 'i' } },
        { category: { $regex: searchTerms.join('|'), $options: 'i' } },
        { gender: { $regex: searchTerms.join('|'), $options: 'i' } },
        { color: { $regex: searchTerms.join('|'), $options: 'i' } },
        { productCode: { $regex: searchTerms.join('|'), $options: 'i' } },
      ];
    }

    if (category) filters.category = { $in: category.split(',') };

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    if (brand) filters.brand = { $in: brand.split(',') };

    if (color) filters.color = { $in: color.split(',') };

    if (sizes) filters.sizes = { $in: sizes.split(',') };

    if (gender) filters.gender = gender;

    let query = Product.find(filters);

    if (sort) {
      const direction = sort.startsWith('-') ? -1 : 1;
      const field = sort.replace('-', '');
      query = query.sort({ [field]: direction });
    }

    if (limit) {
      query = query.limit(limit);
    }

    const products = await query;

    if (products.length === 0) {
      return NextResponse.json(
        {
          message: 'No products found matching the criteria.',
          products: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch items.' },
      { status: 500 }
    );
  }
};


export const POST = async (req: NextRequest) => {
    try {
      const secret = process.env.NEXTAUTH_SECRET;
      const token = await getToken({ req, secret });
  
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Please log in.' },
          { status: 401 }
        );
      }
  
      const {
        name,
        productCode,
        category,
        mainImage,
        images,
        price,
        sizes,
        color,
        brand,
        stock,
        inStock,
        gender
      } = await req.json();
  
      if (!name || !productCode || !category || !mainImage || !images || !price || !sizes || !color || !brand || stock === undefined || inStock === undefined || !gender) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'All fields are required.' },
          { status: 400 }
        );
      }
  
      await connectToDB();
  
      const newProduct = new Product({
        name,
        productCode,
        category,
        mainImage,
        images,
        price,
        sizes,
        color,
        brand,
        stock,
        inStock,
        gender
      });
  
      await newProduct.save();
  
      return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to create product.' },
        { status: 500 }
      );
    }
};