import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import ModalProvider from "@/providers/ModalProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/Toaster";
import ThemeProvider from "@/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "Admin dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      // appearance={{
      //   baseTheme: dark,
      // }}

      appearance={{
        elements: {
          formButtonPrimary:
            "bg-slate-500 hover:bg-slate-400 text-sm normal-case",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryProvider>
              <ModalProvider />

              {children}
            </QueryProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
