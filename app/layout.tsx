import type { Metadata } from "next";
import WalletContextProvider from "./context/walletProvider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

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
        className={`antialiased`}
        style={{
          backgroundImage: 'url("/images/bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
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
