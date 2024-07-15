import Navbar from '@/components/nav/Navbar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container my-6">{children}</main>
      </body>
    </html>
  );
}
