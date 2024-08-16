'use client';

import { emailOrderHistory } from '@/app/actions/orderhistory';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState, useFormStatus } from 'react-dom';

const MyOrdersPage = () => {
  const [data, action] = useFormState(emailOrderHistory, {});

  return (
    <main className="max-w-xl mx-auto">
      <form action={action} noValidate>
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              Enter your email and we will email you your order history and
              download links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" id="email" required />
              <div className="text-sm text-destructive">
                {data?.error && data.error}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {data?.message ? <p>{data.message}</p> : <SubmitBtn />}
          </CardFooter>
        </Card>
      </form>
    </main>
  );
};

const SubmitBtn = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" size="lg" disabled={pending} type="submit">
      {pending ? 'Sending...' : 'Send'}
    </Button>
  );
};

export default MyOrdersPage;
