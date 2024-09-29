import type { Metadata } from "next";
import localFont from "next/font/local";
import WalletContextProvider from "./context/walletProvider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Velox Finanace",
  description:
    "A token exchange platform on Solana, utilizing ZK compression to deliver fast, cost-effective transactions.",
  openGraph: {
    images: "/opengraph-image.png",
  },
  twitter: {
    title: "Velox Finanace",
    description:
      "A token exchange platform on Solana, utilizing ZK compression to deliver fast, cost-effective transactions.",
    images: "/twitter-image.png",
    creator: "@codewithmide",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletContextProvider>
          {children}
          <Toaster />
          <Analytics />
        </WalletContextProvider>
      </body>
    </html>
  );
}
