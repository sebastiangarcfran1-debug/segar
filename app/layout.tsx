import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEGAR AI MARKETING — Tu Director de Marketing con Inteligencia Artificial',
  description: 'Automatiza tus 30 posts del mes, crea anuncios de alto impacto y activa un Closer de Ventas por WhatsApp e Instagram 24/7 sin pagar sueldos de agencia.',
  keywords: ['marketing digital chile', 'inteligencia artificial pymes', 'crear contenido instagram', 'closer ventas whatsapp', 'mercadopago marketing'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
