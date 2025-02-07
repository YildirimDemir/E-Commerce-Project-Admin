import mongoose, { Model, Schema } from "mongoose";

export interface IAdmin extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: "admin";
    createdAt: Date;
  }
  

const adminSchema = new Schema<IAdmin>({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: [true, 'A password is required'],
      },
    role: {
        type: String,
        default: "admin",
    },
}, {
    timestamps: true,
});

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;