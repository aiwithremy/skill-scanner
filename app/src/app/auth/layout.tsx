export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      {children}
    </div>
  );
}
