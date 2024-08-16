import db from '@/databases/db';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (
    paymentIntent.metadata.productId == null ||
    paymentIntent.metadata.productId === undefined
  )
    return notFound();

  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });

  if (product == null) return notFound();

  const isSucceeded = paymentIntent.status === 'succeeded';

  return (
    <main className="w-full max-w-5xl mx-auto flex flex-col gap-y-6">
      <h1>{isSucceeded ? 'Successful' : 'Unsuccessful'}</h1>
      <div className="w-full max-w-[300px] mx-auto">
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          priceIncents={product.priceInCents}
          imagePath={product.imagePath}
          showBuyBtn={false}
        />
      </div>
      <Button className="mt-4" size="lg" asChild>
        {isSucceeded ? (
          <a
            href={`/products/download/${await createDownloadVerificationId(
              product.id
            )}`}
            download
          >
            Download
          </a>
        ) : (
          <Link href={`/products/${paymentIntent.metadata.productId}/purchase`}>
            Try Again
          </Link>
        )}
      </Button>
    </main>
  );
}

async function createDownloadVerificationId(
  productId: string
): Promise<string> {
  return (
    await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
  ).id;
}
