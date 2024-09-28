"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Navbar = () => {
  return (
    <nav className="p-6 between w-full">
      <h2 className="text-2xl font-medium">Velox</h2>
      <WalletMultiButton />
    </nav>
  );
};

export default Navbar;
