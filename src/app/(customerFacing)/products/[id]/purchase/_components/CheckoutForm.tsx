'use client';

import { isUserOrderExists } from '@/app/actions/order';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';

type CheckoutFormProps = {
  productId: string;
  priceInCents: number;
  clientSecret: string;
};

const stripeClient = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function CheckoutForm({
  productId,
  priceInCents,
  clientSecret,
}: CheckoutFormProps) {
  return (
    <Elements options={{ clientSecret }} stripe={stripeClient}>
      <Form productId={productId} priceInCents={priceInCents} />
    </Elements>
  );
}

type FormProps = {
  productId: string;
  priceInCents: number;
};

const Form = ({ productId, priceInCents }: FormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (stripe == null || elements == null || email === '') return;

    setIsLoading(true);

    const orderExists = await isUserOrderExists(email, productId);

    if (orderExists) {
      setErrorMsg(
        'You have already purchased this product. Try downloading it from the My Orders page'
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMsg(error.message as string);
        } else {
          setErrorMsg('Unknown error');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Checkout</CardTitle>
          {errorMsg !== '' && (
            <CardDescription className="text-destructive text-center">
              {errorMsg}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? 'Buying...'
              : `Buy - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
