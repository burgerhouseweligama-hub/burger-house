import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

// PUT update a category by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        // Check if category exists
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Update fields
        if (body.name) {
            category.name = body.name;
        }
        if (body.image !== undefined) {
            category.image = body.image;
        }

        await category.save();

        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

// DELETE a category by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        // Check if category exists
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Check if any products are using this category
        const productsWithCategory = await Product.countDocuments({ category: id });
        if (productsWithCategory > 0) {
            return NextResponse.json(
                { error: `Cannot delete category. ${productsWithCategory} product(s) are using this category.` },
                { status: 400 }
            );
        }

        await Category.findByIdAndDelete(id);

        return NextResponse.json(
            { message: 'Category deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
