"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import "@solana/wallet-adapter-react-ui/styles.css";

const Navbar = () => {
  return (
    <nav className="md:p-6 pt-6 between w-full">
      <div className="gap-10 flex items-end">
        <Link href="/" target="_blank" className="md:text-[18px] font-bold">Velox Finance</Link>
      </div>
      <WalletMultiButton />
    </nav>
  );
};

export default Navbar;
