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
import { DeleteDropdownMenuItem } from './_components/UserActions';

const getAllUsers = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users;
};

const AdminUsersPage = async () => {
  const users = await getAllUsers();

  return (
    <>
      <div className="flex justify-between items-center gap-4 mb-4">
        <PageHeader>Users</PageHeader>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Spending</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.orders.length}</TableCell>
                <TableCell>
                  {formatCurrency(
                    user.orders.reduce(
                      (sum, cv) => sum + cv.pricePaidInCents,
                      0
                    ) / 100
                  )}
                </TableCell>
                <TableCell>
                  {
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical />
                        <span className="sr-only">Actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DeleteDropdownMenuItem id={user.id} />
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
