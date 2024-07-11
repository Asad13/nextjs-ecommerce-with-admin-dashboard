import db from '@/databases/db';
import PageHeader from '../../../_components/PageHeader';
import ProductForm from '../../_components/ProductForm';
import { notFound } from 'next/navigation';

const AdminProductsEditPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
};

export default AdminProductsEditPage;
