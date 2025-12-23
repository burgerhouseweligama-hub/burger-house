import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        // Validate base64 image format
        if (!image.startsWith('data:image/')) {
            return NextResponse.json(
                { error: 'Invalid image format. Please provide a base64 encoded image.' },
                { status: 400 }
            );
        }

        const imageUrl = await uploadImage(image);

        return NextResponse.json(
            { url: imageUrl },
            { status: 200 }
        );
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}
