"use client";

import { useState } from "react";
import SortingTab from "../molecules/Tabs";
import SwapComponent from "../../swap/components/SwapComponent";
import MintComponent from "@/app/mint/components/MintComponent";
import DCAComponent from "@/app/dca/components/DCAComponent";

const TabSection = () => {
  const [activeTab, setActiveTab] = useState("Swap");
  const tapOptions = ["Swap", "Mint", "DCA"];

  const selectTab = (option: string) => {
    setActiveTab(option);
  };

  return (
    <div className="center flex-col w-full">
      <div>
        <SortingTab
          options={tapOptions}
          active={activeTab}
          select={(option: string) => selectTab(option)}
        />
      </div>

      <div className="mt-10 w-full center">
        {activeTab === "Swap" && <SwapComponent />}
        {activeTab === "Mint" && <MintComponent />}
        {activeTab === "DCA" && <DCAComponent />}
      </div>
    </div>
  );
};

export default TabSection;
