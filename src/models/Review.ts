import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    reviewerName: string;
    rating: number;
    comment: string;
    images: string[];
    userImage?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reviewerName: {
            type: String,
            required: [true, 'Reviewer name is required'],
            trim: true,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Comment is required'],
            trim: true,
        },
        images: {
            type: [String],
            validate: [
                (val: string[]) => val.length <= 5,
                '{PATH} exceeds the limit of 5',
            ],
        },
        userImage: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved', // Auto-approve for now as per "simple" requirements usually imply immediate visibility unless specified
        },
    },
    {
        timestamps: true,
    }
);

const Review: Model<IReview> =
    mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
