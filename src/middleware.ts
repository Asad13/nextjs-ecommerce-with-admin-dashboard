import { NextRequest, NextResponse } from 'next/server';
import { validatePassword } from './lib/validate-password';

export async function middleware(req: NextRequest) {
  const isAuthenticated = await authenticate(req);

  if (!isAuthenticated) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic',
      },
    });
  }
}

async function authenticate(req: NextRequest): Promise<boolean> {
  const authHeader =
    req.headers.get('Authorization') ?? req.headers.get('authorization');

  if (authHeader == null) return false;

  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');

  if (username !== process.env.ADMIN_USERNAME) return false;

  return await validatePassword(
    password,
    process.env.ADMIN_HASHED_PASSWORD as string
  );
}

export const config = {
  matcher: '/admin/:path*',
};
