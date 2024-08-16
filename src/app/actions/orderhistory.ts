'use server';

import db from '@/databases/db';
import { z } from 'zod';
import { Resend } from 'resend';
import OrderHistoryEmail from '@/emails/OrderHistoryEmail';

const resend = new Resend(process.env.RESEND_API_KEY as string);

const emailSchema = z
  .string({ message: 'Value must be a string' })
  .email('Invalid Email');

export async function emailOrderHistory(
  prevState: unknown,
  formdata: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formdata.get('email'));

  if (!result.success) {
    return {
      error: result.error.errors[0].message,
    };
  }

  const user = await db.user.findUnique({
    where: {
      email: result.data,
    },
    select: {
      email: true,
      orders: {
        select: {
          id: true,
          pricePaidInCents: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (user == null) {
    return {
      message:
        'Check your email to view your order history and download your products.',
    };
  }

  const orders = user.orders.map(async (order) => {
    return {
      ...order,
      downloadVerificationId: (
        await db.downloadVerification.create({
          data: {
            productId: order.product.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        })
      ).id,
    };
  });

  const { error } = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: 'Order History',
    react: OrderHistoryEmail({
      orders: await Promise.all(orders),
    }),
  });

  if (error) {
    return {
      error: 'There was an error sending your email. Please try again.',
    };
  }

  return {
    message:
      'Check your email to view your order history and download your products.',
  };
}
