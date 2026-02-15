
import type { Metadata } from "next";
import "./globals.css";
import { nunito } from "./font";
import NextTopLoader from "nextjs-toploader";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Village Food | Best E-commerce Platform in BD",
  description: "Best E-commerce Platform in BD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased `}>
        <NextTopLoader showSpinner={false} color="#05a845" />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
