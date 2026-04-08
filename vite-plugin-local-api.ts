import { Plugin, Connect } from 'vite';
import { IncomingMessage, ServerResponse } from 'http';
import handler from './api/gemini';

// Helper to read body data
function readBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk) => {
            chunks.push(Buffer.from(chunk));
        });
        req.on('end', () => {
            try {
                const body = Buffer.concat(chunks).toString('utf-8');
                if (!body) resolve({});
                else resolve(JSON.parse(body));
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', (err) => reject(err));
    });
}

export function localApiPlugin(): Plugin {
    return {
        name: 'vite-plugin-local-api',
        configureServer(server) {
            server.middlewares.use(
                '/api/gemini',
                async (req: Connect.IncomingMessage, res: ServerResponse, next) => {
                    if (req.method !== 'POST') {
                        next();
                        return;
                    }

                    try {
                        const body = await readBody(req);

                        // Mock req.body for the Vercel-like handler
                        (req as any).body = body;

                        // Mock res.status and res.json
                        const originalWrite = res.write;
                        const originalEnd = res.end;

                        // Simple mock for status
                        (res as any).status = (statusCode: number) => {
                            res.statusCode = statusCode;
                            return res; // chaining
                        };

                        // Simple mock for json
                        (res as any).json = (data: any) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(data));
                            return res;
                        };

                        // Call the handler
                        await handler(req as any, res as any);
                    } catch (err) {
                        console.error('Error in local API middleware:', err);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Internal Server Error', details: String(err) }));
                    }
                }
            );
        },
    };
}
