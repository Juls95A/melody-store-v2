import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Playfair_Display } from "next/font/google";
import AuthProvider from "@/features/auth/components/AuthProvider";
import Navbar from "@/features/common/components/Navbar";
import Footer from "@/features/common/components/Footer";
import CanastaProvider from "@/features/solicitudes/components/CanastaProvider";
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Melody Store",
    template: "%s - Melody Store",
  },
  description: "Instrumentos musicales para cada etapa de tu camino.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${dmMono.variable} ${cormorant.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="isolate flex min-h-full flex-col bg-negro font-mono leading-[1.6] text-marfil">
        <AuthProvider>
          <CanastaProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CanastaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
