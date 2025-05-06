import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ProgressCircle } from '@/components/ui/progress-circle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookNest',
  description: 'Browse and purchase books online',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" sizes="any" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow container mx-auto px-0 py-8">
                {children}
              </main>
              <ProgressCircle />
              <Footer />
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 