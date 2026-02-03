import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { addSSEClient, removeSSEClient } from '@/lib/realtime';

export const runtime = 'nodejs';

export async function GET() {
    const auth = await verifyAuth();

    if (!auth || auth.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Variables captured by closure for cleanup
    let heartbeatInterval: NodeJS.Timeout | null = null;
    let sseClient: ReturnType<typeof addSSEClient> | null = null;
    let active = true;

    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            sseClient = addSSEClient(controller);

            // Initial heartbeat
            controller.enqueue(new TextEncoder().encode(': connected\n\n'));

            heartbeatInterval = setInterval(() => {
                if (!active) return;
                try {
                    controller.enqueue(new TextEncoder().encode(`: heartbeat ${Date.now()}\n\n`));
                } catch {
                    active = false;
                    if (heartbeatInterval) clearInterval(heartbeatInterval);
                    if (sseClient) removeSSEClient(sseClient);
                }
            }, 30000);
        },
        cancel() {
            active = false;
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            if (sseClient) removeSSEClient(sseClient);
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
