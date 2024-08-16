import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components';
import OrderInformation from '../components/email/OrderInformation';

type PurchaseReceiptEmailProps = {
  product: {
    name: string;
    imagePath: string;
    description: string;
  };
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  downloadVerificationId: string;
};

const PurchaseReceiptEmail = ({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) => {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              product={product}
              order={order}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: 'Test Product',
    imagePath:
      '/products/19fea131-5a82-470c-b406-866afcda2d7d-Screenshot (220).png',
    description: 'Hello World',
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 10000,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

export default PurchaseReceiptEmail;
