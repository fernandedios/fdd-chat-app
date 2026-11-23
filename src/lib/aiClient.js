const endpoint = (baseUrl, path) => `${baseUrl.trim().replace(/\/+$/, '')}${path}`;

const authHeaders = (apiKey) => (apiKey?.trim() ? { Authorization: `Bearer ${apiKey.trim()}` } : {});

// Streams a reply from any OpenAI compatible /chat/completions endpoint.
export async function* streamChat({ baseUrl, apiKey, model, messages, signal, fetchImpl = fetch }) {
  const res = await request(fetchImpl, endpoint(baseUrl, '/chat/completions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(apiKey) },
    body: JSON.stringify({ model: model.trim(), messages, stream: true }),
    signal,
  });
  await assertApiResponse(res);

  // Some servers ignore stream: true and answer with plain JSON
  if (!res.headers.get('content-type')?.includes('text/event-stream') || !res.body) {
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (text) yield text;
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line.startsWith('data:')) continue;

      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      const text = parse(data)?.choices?.[0]?.delta?.content;
      if (text) yield text;
    }
  }
}

// Lists model ids from /models, used by the settings connection test.
export async function listModels({ baseUrl, apiKey, fetchImpl = fetch }) {
  const res = await request(fetchImpl, endpoint(baseUrl, '/models'), { headers: authHeaders(apiKey) });
  await assertApiResponse(res);
  const data = await res.json();
  return (data.data ?? data.models ?? []).map((m) => m.id ?? m.name).filter(Boolean);
}

// Browsers report CORS and network failures as a bare TypeError
async function request(fetchImpl, url, init) {
  try {
    return await fetchImpl(url, init);
  } catch (err) {
    if (err.name !== 'TypeError') throw err;
    throw new Error(
      'Could not reach the AI server. It may be offline, or blocking browser requests (CORS). ' +
        'For local or LAN servers, use the /ai-proxy base URL described in the README.',
      { cause: err },
    );
  }
}

async function assertApiResponse(res) {
  if (!res.ok) throw new Error(await errorMessage(res));
  // A web page instead of JSON usually means a wrong base URL or the proxy is not running
  if (res.headers.get('content-type')?.includes('text/html')) {
    throw new Error(
      'The AI base URL returned a web page instead of an API response. Check that it ends in /v1, ' +
        'and if you use /ai-proxy, that the dev server was started with AI_PROXY_TARGET.',
    );
  }
}

function parse(data) {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function errorMessage(res) {
  const body = await res.text().catch(() => '');
  const detail = parse(body)?.error?.message ?? body.slice(0, 200);
  return `AI request failed (${res.status})${detail ? `: ${detail}` : ''}`;
}
