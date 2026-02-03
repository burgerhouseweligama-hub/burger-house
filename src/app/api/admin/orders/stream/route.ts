import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { addSSEClient, removeSSEClient } from '@/lib/realtime';

export const runtime = 'nodejs';

export async function GET() {
    const auth = await verifyAuth();

    if (!auth || auth.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            const client = addSSEClient(controller);

            // Initial heartbeat
            controller.enqueue(new TextEncoder().encode(': connected\n\n'));

            const heartbeat = setInterval(() => {
                controller.enqueue(new TextEncoder().encode(`: heartbeat ${Date.now()}\n\n`));
            }, 30000);

            controller.oncancel = () => {
                clearInterval(heartbeat);
                removeSSEClient(client);
            };
        },
        cancel() {
            // No-op: handled in oncancel
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    });
}
