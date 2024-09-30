"use client";

import Navbar from "../components/Navbar";
import MintComponent from "./components/MintComponent";

const Mint = () => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-6 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <MintComponent />
    </div>
  );
};

export default Mint;
