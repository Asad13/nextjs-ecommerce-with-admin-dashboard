import {
  ProductCard,
  ProductCardSkeleton,
} from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import db from '@/databases/db';
import { cache } from '@/lib/cache';
import { Product } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: 'desc' } },
      take: 6,
    });
  },
  ['/', 'getMostPopularProducts'],
  { revalidate: 24 * 60 * 60 }
);

const getLatestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
}, ['/', 'getLatestProducts']);

export default function Home() {
  return (
    <div>
      <HomeProductSection
        title="Most Popular"
        fetcher={getMostPopularProducts}
      />
      <HomeProductSection title="Latest" fetcher={getLatestProducts} />
    </div>
  );
}

type HomeProductSectionProps = {
  title: string;
  fetcher: () => Promise<Product[]>;
};

function HomeProductSection({ title, fetcher }: HomeProductSectionProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold">{title}</h2>
        <Button asChild variant="outline">
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <HomeProductCardContainer fetcher={fetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function HomeProductCardContainer({
  fetcher,
}: {
  fetcher: () => Promise<Product[]>;
}) {
  return (await fetcher()).map((product) => (
    <ProductCard
      key={product.id}
      id={product.id}
      name={product.name}
      description={product.description}
      priceIncents={product.priceInCents}
      imagePath={product.imagePath}
    />
  ));
}
