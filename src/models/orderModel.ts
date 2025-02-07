import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAddress {
    fullName: string;
    addressLine: string;
    apartment?: string;
    city: string;
    state: string;
    country: string;
    zipPostalCode: string;
}

export interface IOrder extends Document {
    _id: string;
    user: mongoose.Types.ObjectId;
    address: IAddress;
    totalPrice: number;
    status: "pending" | "delivered" | "canceled" | "shipped" | "processing"; 
    items: { 
        product: mongoose.Types.ObjectId;
        quantity: number;
        price: number; 
    }[];
    orderNumber: string;
    deliveryDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const addressSchema: Schema<IAddress> = new Schema({
    fullName: { type: String, required: true },
    addressLine: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipPostalCode: { type: String, required: true },
});

const orderSchema: Schema<IOrder> = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'delivered', 'canceled', 'shipped', 'processing'],
      default: 'pending',
      required: true,
    },
    items: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true 
        },
        price: { 
            type: Number, 
            required: true 
        }
    }],
    orderNumber: {
      type: String,
      required: true
    },
    deliveryDate: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    }
}, { timestamps: true });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
export default Order;
