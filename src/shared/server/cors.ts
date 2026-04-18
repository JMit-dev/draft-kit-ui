import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

function getCorsOrigin(request: Request): string | null {
  const origin = request.headers.get('origin');

  if (!origin) {
    return null;
  }

  return ALLOWED_ORIGINS.has(origin) ? origin : null;
}

export function withCors(
  request: Request,
  response: NextResponse,
): NextResponse {
  const origin = getCorsOrigin(request);

  if (!origin) {
    return response;
  }

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Vary', 'Origin');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, DELETE, OPTIONS',
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, x-api-key',
  );

  return response;
}

export function handleOptions(request: Request): NextResponse {
  return withCors(request, new NextResponse(null, { status: 204 }));
}
