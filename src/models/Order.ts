import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface IDeliveryDetails {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
}

export interface IOrder extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    email: string;
    phone: string;
    deliveryDetails: IDeliveryDetails;
    items: IOrderItem[];
    totalAmount: number;
    paymentMethod: 'cash_on_delivery';
    status: 'received' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
    orderNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    image: {
        type: String,
        default: '',
    },
});

const DeliveryDetailsSchema = new Schema<IDeliveryDetails>({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
    },
    postalCode: {
        type: String,
        required: [true, 'Postal code is required'],
        trim: true,
    },
});

const OrderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        deliveryDetails: {
            type: DeliveryDetailsSchema,
            required: true,
        },
        items: {
            type: [OrderItemSchema],
            required: true,
            validate: {
                validator: function (items: IOrderItem[]) {
                    return items.length > 0;
                },
                message: 'Order must have at least one item',
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: [0, 'Total amount cannot be negative'],
        },
        paymentMethod: {
            type: String,
            enum: ['cash_on_delivery'],
            default: 'cash_on_delivery',
        },
        status: {
            type: String,
            enum: ['received', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
            default: 'received',
        },
        orderNumber: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

// Generate unique order number before saving
OrderSchema.pre('save', async function () {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.orderNumber = `BH-${timestamp}-${random}`;
    }
});

// Indexes for common queries
OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
