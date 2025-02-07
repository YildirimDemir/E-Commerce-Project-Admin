import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    _id: string;
    productCode: string;
    name: string;
    category: string;
    mainImage: string;
    images: string[];
    price: number;
    sizes: number[];
    color: string;
    brand: string;
    stock: number; 
    inStock: boolean;
    gender: "men" | "women" | "kid";
    createdAt: Date;
}

const productSchema: Schema<IProduct> = new Schema({
    name: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
      unique: true
    },
    category: {
      type: String,
      required: true,
      enum: ['sneaker', 'running', 'football', 'basketball', 'slipper'],
    },
    mainImage: {
      type: String,
      required: true,
    },
    images: [{
        type: String,
    }],
    price: {
      type: Number,
      required: true,
    },
    sizes: [{
        type: Number,
        enum: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], 
        required: true,
    }],
    color: {
        type: String,
        enum: ['red', 'blue', 'black', 'white', 'gray', 'green', 'yellow'], 
        required: true,
    },
    brand: {
        type: String,
        enum: ['nike', 'adidas', 'puma', 'under armour', 'new balance'],
        required: true,
    },
    stock: { 
      type: Number,
      required: true,
      min: [0, 'Stock cannot be less than 0'],
    },
    inStock: { 
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'kid'], 
      required: true,
    }
}, { timestamps: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
export default Product;
