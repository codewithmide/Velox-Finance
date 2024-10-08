"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="p-6 between w-full">
      <div className="gap-10 flex items-end">
        <Link href="/" target="_blank" className="text-2xl font-medium">Velox Finance</Link>
        <Link href="/swap" target="_blank" className="underline text-lg">
          Swap
        </Link>
        <Link href="/mint" target="_blank" className="underline text-lg">
          Mint
        </Link>
        <Link href="/liquidity" target="_blank" className="underline text-lg">
          Liquidity Pool
        </Link>
      </div>
      <WalletMultiButton />
    </nav>
  );
};

export default Navbar;
