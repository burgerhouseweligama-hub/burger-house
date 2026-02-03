import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

// GET products with optional pagination and filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('category');
        const availableOnly = searchParams.get('available') === 'true';
        const search = searchParams.get('search')?.trim() || '';
        const pageParam = searchParams.get('page');
        const limitParam = searchParams.get('limit');

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (categoryId) {
            query.category = categoryId;
        }

        if (availableOnly) {
            query.isAvailable = true;
        }

        // Search by product name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Check if pagination is requested
        const isPaginated = pageParam || limitParam;

        if (isPaginated) {
            // Paginated response
            const page = pageParam ? Math.max(parseInt(pageParam, 10), 1) : 1;
            const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 100) : 10;
            const skip = (page - 1) * limit;

            const [products, total] = await Promise.all([
                Product.find(query)
                    .populate('category', 'name slug')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Product.countDocuments(query),
            ]);

            const totalPages = Math.ceil(total / limit);

            return NextResponse.json({
                products,
                total,
                page,
                limit,
                totalPages,
            }, { status: 200 });
        }

        // Non-paginated response (backward compatible for public menu)
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST create a new product
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, description, price, category, image, isAvailable } = body;

        // Validation
        if (!name || name.trim() === '') {
            return NextResponse.json(
                { error: 'Product name is required' },
                { status: 400 }
            );
        }

        if (price === undefined || price === null || price < 0) {
            return NextResponse.json(
                { error: 'Valid price is required' },
                { status: 400 }
            );
        }

        if (!category) {
            return NextResponse.json(
                { error: 'Category is required' },
                { status: 400 }
            );
        }

        // Verify category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return NextResponse.json(
                { error: 'Invalid category' },
                { status: 400 }
            );
        }

        const product = await Product.create({
            name: name.trim(),
            description: description?.trim() || '',
            price: Number(price),
            category,
            image: image || '',
            isAvailable: isAvailable !== undefined ? isAvailable : true,
        });

        const populatedProduct = await Product.findById(product._id).populate(
            'category',
            'name slug'
        );

        return NextResponse.json(populatedProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
