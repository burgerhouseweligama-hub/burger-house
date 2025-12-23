import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

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
