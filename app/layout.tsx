import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from "next/script";
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FarmaFácil - Digitaliza tu Farmacia',
  description: 'Catálogo conectado, pedidos online y atención automática con IA.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        
        {/* GA4: carga */}
        <Script 
          async 
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} 
        />

        {/* GA4: inicialización */}
        <Script
          id="ga-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        <CartProvider>
          {children}
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
