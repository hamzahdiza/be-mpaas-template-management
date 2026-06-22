import app from '../src/app';

export const config = { api: { bodyParser: false } };

export default async function handler(req: any, res: any) {
    const protocol = (req.headers['x-forwarded-proto'] as string) || 'https';
    const host = (req.headers.host as string) || 'localhost';
    const url = `${protocol}://${host}${req.url}`;

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers as Record<string, string | string[]>)) {
        if (val) headers.set(key, Array.isArray(val) ? val[0] : val);
    }

    let body: ArrayBuffer | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        if (chunks.length) {
            const concat = Buffer.concat(chunks);
            body = concat.buffer.slice(concat.byteOffset, concat.byteOffset + concat.byteLength) as ArrayBuffer;
        }
    }

    const response = await app.fetch(new Request(url, {
        method: req.method || 'GET',
        headers,
        body: body && body.byteLength > 0 ? body : undefined,
    }));

    res.status(response.status);
    response.headers.forEach((val: string, key: string) => res.setHeader(key, val));
    res.send(Buffer.from(await response.arrayBuffer()));
}
