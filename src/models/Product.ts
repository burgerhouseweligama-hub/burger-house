import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    category: mongoose.Types.ObjectId;
    image: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
            default: '',
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        image: {
            type: String,
            default: '',
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for category-based queries
ProductSchema.index({ category: 1 });
ProductSchema.index({ isAvailable: 1 });

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
