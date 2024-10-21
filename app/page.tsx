import Image from "next/image";
import Navbar from "./components/Navbar";
import TabSection from "./components/tabs/page";

export default function Home() {
  return (
    <div className="center flex-col min-h-screen p-3 md:p-6 md:pb-[18rem] pb-[8rem] gap-16">
      <Navbar />
      <div className="flex-col center xl:w-[48%] md:w-[90%] gap-6">
        <h1 className="lg:text-[72px] md:text-[60px] text-[30px] text-center leading-none font-bold gradient-text">
          Navigate Solana's Compressed Assets
        </h1>
        <p className="text-center md:w-[80%] w-[90%] mb-[4rem]">
          A powerful tool that finds and indexes compressed tokens across
          the Solana network, making them easier to discover and manage.
        </p>
        <TabSection />
      </div>
    </div>
  );
}
