import { TextEncoder } from 'util';

interface SSEClient {
    id: number;
    controller: ReadableStreamDefaultController<Uint8Array>;
}

declare const global: typeof globalThis & {
    __orderSSEClients?: Set<SSEClient>;
};

const clients: Set<SSEClient> = global.__orderSSEClients || new Set();
if (!global.__orderSSEClients) {
    global.__orderSSEClients = clients;
}

const encoder = new TextEncoder();

export function addSSEClient(controller: ReadableStreamDefaultController<Uint8Array>): SSEClient {
    const client: SSEClient = { id: Date.now(), controller };
    clients.add(client);
    return client;
}

export function removeSSEClient(client: SSEClient) {
    clients.delete(client);
}

export function broadcastEvent(event: string, data: unknown) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoded = encoder.encode(payload);
    for (const client of clients) {
        try {
            client.controller.enqueue(encoded);
        } catch (error) {
            // Drop broken clients silently
            clients.delete(client);
        }
    }
}
