import db from '@/databases/db';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import CheckoutForm from './_components/CheckoutForm';
import { ProductCard } from '@/components/product/ProductCard';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function ProductPurchase({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: 'usd',
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret == null) return notFound();

  return (
    <main className="w-full max-w-5xl mx-auto flex flex-col gap-y-6">
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
      <CheckoutForm
        productId={product.id}
        priceInCents={product.priceInCents}
        clientSecret={paymentIntent.client_secret}
      />
    </main>
  );
}
