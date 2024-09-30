"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="p-6 between w-full">
      <div className="gap-10 flex items-end">
        <Link href="/" className="text-2xl font-medium">Velox Finance</Link>
        <Link href="/mint" className="underline text-lg">
          Mint
        </Link>
      </div>
      <WalletMultiButton />
    </nav>
  );
};

export default Navbar;
