import { describe, expect, it, vi } from 'vitest';
import { listModels, streamChat } from '../../src/lib/aiClient.js';

const sse = (chunks) =>
  new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        chunks.forEach((c) => controller.enqueue(encoder.encode(c)));
        controller.close();
      },
    }),
    { headers: { 'content-type': 'text/event-stream' } },
  );

const delta = (text) => `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;

async function collect(gen) {
  let out = '';
  for await (const chunk of gen) out += chunk;
  return out;
}

const base = { baseUrl: 'https://api.example.com/v1/', apiKey: 'sk-test', model: 'm', messages: [] };

describe('streamChat', () => {
  it('streams deltas, including chunks split mid line', async () => {
    const body = delta('Hey') + delta(' there');
    const fetchImpl = vi.fn().mockResolvedValue(sse([body.slice(0, 20), body.slice(20), 'data: [DONE]\n\n']));
    expect(await collect(streamChat({ ...base, fetchImpl }))).toBe('Hey there');

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://api.example.com/v1/chat/completions');
    expect(init.headers.Authorization).toBe('Bearer sk-test');
    expect(JSON.parse(init.body)).toMatchObject({ model: 'm', stream: true });
  });

  it('skips the auth header when no key is given', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(sse([delta('ok')]));
    await collect(streamChat({ ...base, apiKey: '', fetchImpl }));
    expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('handles plain JSON replies', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(Response.json({ choices: [{ message: { content: 'Plain' } }] }));
    expect(await collect(streamChat({ ...base, fetchImpl }))).toBe('Plain');
  });

  it('surfaces API errors', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(Response.json({ error: { message: 'Invalid API key' } }, { status: 401 }));
    await expect(collect(streamChat({ ...base, fetchImpl }))).rejects.toThrow('AI request failed (401): Invalid API key');
  });

  it('explains network and CORS failures', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(collect(streamChat({ ...base, fetchImpl }))).rejects.toThrow(/CORS/);
  });

  it('explains HTML responses from a wrong URL or missing proxy', async () => {
    const page = new Response('<!doctype html><html></html>', { headers: { 'content-type': 'text/html' } });
    const fetchImpl = vi.fn().mockResolvedValue(page);
    await expect(collect(streamChat({ ...base, fetchImpl }))).rejects.toThrow(/web page/);
  });
});

describe('listModels', () => {
  it('returns model ids', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(Response.json({ data: [{ id: 'a' }, { id: 'b' }] }));
    expect(await listModels({ ...base, fetchImpl })).toEqual(['a', 'b']);
    expect(fetchImpl.mock.calls[0][0]).toBe('https://api.example.com/v1/models');
  });
});
