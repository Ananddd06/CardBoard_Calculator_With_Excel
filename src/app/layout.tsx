import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 text-gray-900 selection:bg-orange-200 antialiased">
        {children}
      </body>
    </html>
  );
}
