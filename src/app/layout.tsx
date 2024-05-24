import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from '@clerk/nextjs'
import Providers from "@/components/Providers";
import "react-loading-skeleton/dist/skeleton.css"
import "simplebar-react/dist/simplebar.min.css"
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Pal",
  description: "Chat with your PDFs in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="light">
        <Providers>
          <body className={cn('min-h-screen font-sans antialiased grainy', inter.className)}>
            <Toaster />
            <Navbar />
            {children}
          </body>
        </Providers>

      </html>
    </ClerkProvider>
  );
}
