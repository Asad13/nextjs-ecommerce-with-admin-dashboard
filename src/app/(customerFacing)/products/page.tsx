import {
  ProductCard,
  ProductCardSkeleton,
} from '@/components/product/ProductCard';
import db from '@/databases/db';
import { cache } from '@/lib/cache';
import { Product } from '@prisma/client';
import { Suspense } from 'react';

const getAllProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: 'asc' },
  });
}, ['/products', 'getAllProducts']);

export default function CustomerProductsPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductsProductCardContainer fetcher={getAllProducts} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductsProductCardContainer({
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
