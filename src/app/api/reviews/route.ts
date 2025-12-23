import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import { verifyAuth } from '@/lib/auth';

// GET: Fetch all reviews
export async function GET() {
    try {
        await connectDB();

        // Parse query params for simple filtering/sorting if needed later
        // For now, just return all approved reviews + all reviews if admin? 
        // The requirement says "Create a review section on the web" -> likely needs approved reviews.
        // "Review management in admin" -> likely needs all reviews (or everything).
        // I'll return all for now and let frontend filter or just return all since default is approved.

        // Sort by createdAt desc
        const reviews = await Review.find().sort({ createdAt: -1 });

        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

// POST: Create a new review
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // 1. Verify Authentication
        const user = await verifyAuth();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in.' },
                { status: 401 }
            );
        }

        // 2. Parse Body
        const body = await request.json();
        const { reviewerName, rating, comment, images, userImage } = body;

        // 3. Validate Inputs
        if (!reviewerName || !rating || !comment) {
            return NextResponse.json(
                { error: 'Missing required fields (reviewerName, rating, comment)' },
                { status: 400 }
            );
        }

        if (images && images.length > 5) {
            return NextResponse.json(
                { error: 'Cannot upload more than 5 images' },
                { status: 400 }
            );
        }

        // 4. Create Review
        const newReview = await Review.create({
            user: user.userId,
            reviewerName,
            rating,
            comment,
            images: images || [],
            userImage,
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { error: 'Failed to create review' },
            { status: 500 }
        );
    }
}
