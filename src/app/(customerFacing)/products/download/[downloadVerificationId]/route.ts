import db from '@/databases/db';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: {
      product: {
        select: {
          filePath: true,
          name: true,
        },
      },
    },
  });

  if (data == null) return NextResponse.redirect('/products/download/expired');

  const { size } = await fs.stat(data.product.filePath);
  const file = await fs.readFile(data.product.filePath);
  const ext = data.product.filePath.split('.').pop();

  return new NextResponse(file, {
    headers: {
      'Content-Disposition': `attachment; filename="${data.product.name}.${ext}"`,
      'Content-Length': size.toString(),
    },
  });
}
