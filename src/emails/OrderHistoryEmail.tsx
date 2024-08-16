import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components';
import OrderInformation from '../components/email/OrderInformation';
import React from 'react';

type OrderHistoryEmailProps = {
  orders: {
    id: string;
    createdAt: Date;
    pricePaidInCents: number;
    product: {
      id: string;
      name: string;
      imagePath: string;
      description: string;
    };
    downloadVerificationId: string;
  }[];
};

const OrderHistoryEmail = ({ orders }: OrderHistoryEmailProps) => {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  product={order.product}
                  order={order}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index !== orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 10000,
      product: {
        id: crypto.randomUUID(),
        name: 'Test Product',
        imagePath:
          '/products/19fea131-5a82-470c-b406-866afcda2d7d-Screenshot (220).png',
        description: 'Hello World',
      },
      downloadVerificationId: crypto.randomUUID(),
    },
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 2500,
      product: {
        id: crypto.randomUUID(),
        name: 'Test Product 2',
        imagePath:
          '/products/ba5e7c30-7492-45d3-a8e7-f4bd1494cafc-Screenshot (263).png',
        description: 'Hello World 2',
      },
      downloadVerificationId: crypto.randomUUID(),
    },
  ],
} satisfies OrderHistoryEmailProps;

export default OrderHistoryEmail;
