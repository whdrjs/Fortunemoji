import {isFortuneInput, readGeneratedScene} from '../christmas.mjs';
import {format, instructions, promptInput} from './fortune-prompt.mjs';

const maxBodyBytes = 4096;

function json(body, status = 200, headers = {}) {
  return Response.json(body, {status, headers: {'Cache-Control': 'no-store', ...headers}});
}

async function readInput(request) {
  if (!request.body || Number(request.headers.get('Content-Length')) > maxBodyBytes) return null;
  const reader = request.body.getReader();
  const bytes = new Uint8Array(maxBodyBytes);
  let size = 0;
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) return JSON.parse(new TextDecoder().decode(bytes.subarray(0, size)));
      if (value.length > maxBodyBytes - size) {
        void reader.cancel().catch(() => {});
        return null;
      }
      bytes.set(value, size);
      size += value.length;
    }
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/fortune') return json({error: 'not_found'}, 404);
  if (request.method !== 'POST') return json({error: 'method_not_allowed'}, 405, {Allow: 'POST'});
  if (request.headers.get('Origin') !== url.origin) return json({error: 'invalid_origin'}, 403);
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') {
    return json({error: 'unsupported_type'}, 415);
  }

  const input = await readInput(request);
  if (!isFortuneInput(input)) return json({error: 'invalid_input'}, 400);
  if (!env.OPENAI_API_KEY || !env.OPENAI_MODEL || !env.FORTUNE_LIMITER) {
    return json({error: 'generation_disabled'}, 503);
  }

  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const limit = await env.FORTUNE_LIMITER.limit({key: ip});
    if (!limit.success) return json({error: 'rate_limited'}, 429);

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        instructions,
        input: JSON.stringify(promptInput(input)),
        text: {format},
        max_output_tokens: 1000,
        store: false
      }),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(12_000)])
    });

    if (!response.ok) return json({error: 'generation_failed'}, 502);
    const data = await response.json();
    const text = data.output?.flatMap(item => item.content ?? [])
      .find(content => content.type === 'output_text')?.text;
    const result = data.status === 'completed' && text && readGeneratedScene(JSON.parse(text), input);
    return result ? json(result) : json({error: 'invalid_output'}, 502);
  } catch {
    return json({error: 'generation_failed'}, 502);
  }
}

export default {fetch: handleRequest};
