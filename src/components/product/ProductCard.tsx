import { formatCurrency } from '@/lib/formatters';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  priceIncents: number;
  imagePath: string;
  showBuyBtn?: boolean;
};

export const ProductCard = ({
  id,
  name,
  description,
  priceIncents,
  imagePath,
  showBuyBtn = true,
}: ProductCardProps) => {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="w-full relative h-auto aspect-video">
        <Image src={imagePath} fill alt={name} />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(priceIncents / 100)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4">{description}</p>
      </CardContent>
      {showBuyBtn && (
        <CardFooter>
          <Button asChild size="lg" className="w-full">
            <Link href={`/products/${id}/purchase`}>BUY</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <Card className="flex flex-col overflow-hidden animate-pulse">
      <div className="w-full h-auto aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 bg-gray-300 rounded-full" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-4 bg-gray-300 rounded-full" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 bg-gray-300 rounded-full" />
        <div className="w-full h-4 bg-gray-300 rounded-full" />
        <div className="w-3/4 h-4 bg-gray-300 rounded-full" />
      </CardContent>
      <CardFooter>
        <Button size="lg" disabled className="w-full"></Button>
      </CardFooter>
    </Card>
  );
};
