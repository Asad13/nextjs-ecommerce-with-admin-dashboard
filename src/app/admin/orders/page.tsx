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
import { formatCurrency } from '@/lib/formatters';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteDropdownMenuItem } from './_components/OrderActions';

const getAllOrders = async () => {
  const orders = await db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      product: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
};

const AdminUsersPage = async () => {
  const orders = await getAllOrders();

  return (
    <>
      <div className="flex justify-between items-center gap-4 mb-4">
        <PageHeader>Orders</PageHeader>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.product.name}</TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>
                  {formatCurrency(order.pricePaidInCents / 100)}
                </TableCell>
                <TableCell>
                  {
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical />
                        <span className="sr-only">Actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DeleteDropdownMenuItem id={order.id} />
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

export default AdminUsersPage;
