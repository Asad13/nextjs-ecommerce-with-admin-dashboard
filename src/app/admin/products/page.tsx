import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PageHeader from '../_components/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import db from '@/databases/db';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { CheckCircle2, MoreVertical, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ActiveToggleDropdownMenuItem,
  DeleteDropdownMenuItem,
} from './_components/ProductActions';

const getAllProducts = async () => {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } },
    },
  });

  return products;
};

const AdminProductsPage = async () => {
  const products = await getAllProducts();

  return (
    <>
      <div className="flex justify-between items-center gap-4 mb-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">
                <span className="sr-only">Available For Purchase</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.isAvailableForPurchase ? (
                    <>
                      <span className="sr-only">Available</span>
                      <CheckCircle2 />
                    </>
                  ) : (
                    <>
                      <span className="sr-only">Unavailable</span>
                      <XCircle className="stroke-destructive" />
                    </>
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {formatCurrency(product.priceInCents / 100)}
                </TableCell>
                <TableCell>{formatNumber(product._count.orders)}</TableCell>
                <TableCell>
                  {
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical />
                        <span className="sr-only">Actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <a
                            href={`/admin/products/${product.id}/download`}
                            download
                          >
                            Download
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <ActiveToggleDropdownMenuItem
                          id={product.id}
                          isAvailableForPurchase={
                            product.isAvailableForPurchase
                          }
                        />
                        <DropdownMenuSeparator />
                        <DeleteDropdownMenuItem id={product.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AdminProductsPage;
