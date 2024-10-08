import Navbar from "../components/Navbar";
import SwapComponent from "../components/Swap";

const SwapScreen = () => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-6 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <SwapComponent />
    </div>
  );
};

export default SwapScreen;
