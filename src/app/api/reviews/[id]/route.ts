import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import { verifyAuth } from '@/lib/auth';

// DELETE: Delete a review (Admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Awaiting params for Next.js 15+ if needed, but standard is context.params
) {
    try {
        const { id } = await params;
        await connectDB();

        // 1. Verify Authentication
        const user = await verifyAuth();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in.' },
                { status: 401 }
            );
        }

        // 2. Find Review
        const review = await Review.findById(id);
        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        // 3. Check Permissions: Admin OR Owner
        // Note: review.user is an ObjectId, so we convert to string for comparison
        if (user.role !== 'admin' && review.user.toString() !== user.userId) {
            return NextResponse.json(
                { error: 'Unauthorized. You can only delete your own reviews.' },
                { status: 403 }
            );
        }

        // 4. Delete Review
        await Review.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json(
            { error: 'Failed to delete review' },
            { status: 500 }
        );
    }
}

// PUT: Update a review (Admin only - optional for simple CRUD but good to have)
// Updating status primarily or content moderation
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        // 1. Verify Authentication & Admin Role
        const user = await verifyAuth();
        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 403 }
            );
        }

        const body = await request.json();
        // Allow updating any field
        const updatedReview = await Review.findByIdAndUpdate(id, body, { new: true, runValidators: true });

        if (!updatedReview) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedReview, { status: 200 });

    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json(
            { error: 'Failed to update review' },
            { status: 500 }
        );
    }
}
