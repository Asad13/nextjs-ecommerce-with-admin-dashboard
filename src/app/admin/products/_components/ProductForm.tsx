'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formatters';
import { useState } from 'react';
import { addProduct, updateProduct } from '../../_actions/products';
import { useFormState, useFormStatus } from 'react-dom';
import { Product } from '@prisma/client';
import Image from 'next/image';

const ProductForm = ({ product }: { product?: Product }) => {
  const [error, action] = useFormState(
    product === undefined ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product !== undefined ? product.priceInCents : undefined
  );

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          defaultValue={product?.name ?? ''}
          required
        />
        <div className="text-destructive">{error.name && error.name}</div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) ?? undefined)}
        />
        <div>
          <span className="text-muted-foreground">
            {formatCurrency((priceInCents ?? 0) / 100)}
          </span>
        </div>

        <div className="text-destructive">
          {error.priceInCents && error.priceInCents}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ''}
          required
        />
        <div className="text-destructive">
          {error.description && error.description}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          type="file"
          id="file"
          name="file"
          required={product === undefined}
        />
        {product !== undefined && (
          <div className="text-muted-foreground">{product.filePath}</div>
        )}
        <div className="text-destructive">{error.file && error.file}</div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          required={product === undefined}
        />
        {product !== undefined && (
          <Image
            src={product.imagePath}
            alt={product.name}
            width={250}
            height={250}
            className="h-auto w-full max-w-[250px]"
          />
        )}
        <div className="text-destructive">{error.image && error.image}</div>
      </div>
      <div className="space-y-2">
        <SubmitBtn isNew={product === undefined} />
      </div>
    </form>
  );
};

const SubmitBtn = ({ isNew }: { isNew: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isNew ? 'Adding' : 'Updating') : isNew ? 'Add' : 'Update'}
    </Button>
  );
};

export default ProductForm;
