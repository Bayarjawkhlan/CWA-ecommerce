import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ModalProvider from "@/provider/ModalProvider";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/provider/QueryProvider";

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store",
  description: "Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className + "h-full"}>
        <QueryProvider>
          <ModalProvider />
          <Toaster />

          <Navbar />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
