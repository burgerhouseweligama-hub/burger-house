import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';

export interface ICategory {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxlength: [50, 'Category name cannot exceed 50 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        image: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Auto-generate slug from name before saving
CategorySchema.pre<HydratedDocument<ICategory>>('save', function () {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
