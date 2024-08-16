'use server';

import db from '@/databases/db';

export async function isUserOrderExists(email: string, productId: string) {
  return (
    (await db.order.findFirst({
      where: {
        user: {
          email,
        },
        product: {
          id: productId,
        },
      },
      select: {
        id: true,
      },
    })) != null
  );
}
