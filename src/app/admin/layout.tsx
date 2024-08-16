import AdminNavbar from '@/components/nav/AdminNavbar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminNavbar />
      <main className="container my-6">{children}</main>
    </>
  );
}
