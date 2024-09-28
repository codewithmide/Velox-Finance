"use client";

import { useState } from "react";
import { Input, Button } from "./molecules/FormComponents";
import DropDownSelect from "./molecules/DropDownSelect";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import Modal from "./molecules/Modal";

const SwapComponent = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("SOL");
  const [toCurrency, setToCurrency] = useState("USDC");
  const [slippage, setSlippage] = useState("1");
  const [customSlippage, setCustomSlippage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const wallet = useWallet();

  const handleFromAmountChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleToAmountChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setToAmount(value);
    }
  };

  const handleSwap = () => {
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);

    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
  };

  const handleSlippageChange = (value: string) => {
    setSlippage(value);
    setModalOpen(false);
  };

  const currencies = [
    { name: "SOL", action: () => setFromCurrency("SOL") },
    { name: "USDC", action: () => setToCurrency("USDC") },
  ];

  return (
    <div className="p-5 bg-[#F8F8F9] shadow flex flex-col gap-4 rounded-lg w-[586px]">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl">Swap</h2>
        <button onClick={() => setModalOpen(true)}>
          <Image
            src="/icon/setting.png"
            alt="settings"
            width={24}
            height={24}
          />
        </button>
      </div>
      <div className="relative flex flex-col gap-6">
        <div className="bg-white flex gap-2 p-3 rounded-lg">
          <Input
            label="From"
            value={fromAmount}
            onChange={handleFromAmountChange}
            name="from"
            placeholder="0.00"
            type="text"
          />
          <DropDownSelect
            cta="Select Currency"
            options={currencies}
            active={fromCurrency}
          />
        </div>
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#D7E4E3] p-3 rounded-lg cursor-pointer"
          onClick={handleSwap}
        >
          <Image src="/icon/filter.png" alt="swap" width={24} height={24} />
        </button>
        <div className="bg-white flex gap-2 p-3 rounded-lg">
          <Input
            label="To"
            value={toAmount}
            onChange={handleToAmountChange}
            name="to"
            placeholder="0.00"
            type="text"
          />
          <DropDownSelect
            cta="Select Currency"
            options={currencies}
            active={toCurrency}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 px-1">
        <div className="between">
          <p>Slippage:</p>
          <p>{slippage}%</p>
        </div>
      </div>
      <Button
        link={() => alert("Swap initiated")}
        cta="Swap"
        classname="mt-4 bg-black text-white w-full"
        validation={!wallet.connected}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-medium my-4">Set Slippage Tolerance</h2>
        <div className="between w-full gap-1">
          <Button cta="1%" classname="w-full border bg-[#F8F8F9]" link={() => handleSlippageChange("1")} />
          <Button cta="0.5%" classname="w-full border bg-[#F8F8F9]" link={() => handleSlippageChange("0.5")} />
          <Button cta="2%" classname="w-full border bg-[#F8F8F9]" link={() => handleSlippageChange("2")} />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Input
            value={customSlippage}
            onChange={(e) => setCustomSlippage(e.target.value)}
            placeholder="Custom %"
            classname="border rounded-lg pl-3 !text-sm"
          />
          <Button
            cta="Save"
            classname="bg-black text-white"
            link={() => handleSlippageChange(customSlippage)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SwapComponent;
