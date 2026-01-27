
import type { Metadata } from "next";
import "./globals.css";
import { lato } from "./font";
import NextTopLoader from "nextjs-toploader";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Silk Thread | Best E-commerce Platform in BD",
  description: "Best E-commerce Platform in BD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.className} antialiased `}>
        <NextTopLoader showSpinner={false} color="#FF6C0C" />
        <LanguageProvider>
          {children}
          </LanguageProvider>
       
      </body>
    </html>
  );
}
