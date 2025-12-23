import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

// GET all categories
export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find({}).sort({ createdAt: -1 });

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST create a new category
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, image } = body;

        if (!name || name.trim() === '') {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            );
        }

        // Check if category with same name exists
        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: 'Category with this name already exists' },
                { status: 400 }
            );
        }

        const category = await Category.create({
            name: name.trim(),
            image: image || '',
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
