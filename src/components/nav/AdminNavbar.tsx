import NavLink from './NavLink';

const AdminNavbar = () => {
  return (
    <nav className="bg-primary text-primary-foreground flex justify-center px-4">
      <NavLink href="/admin">Dashboard</NavLink>
      <NavLink href="/admin/products">Products</NavLink>
      <NavLink href="/admin/users">Customers</NavLink>
      <NavLink href="/admin/orders">Sales</NavLink>
    </nav>
  );
};

export default AdminNavbar;
