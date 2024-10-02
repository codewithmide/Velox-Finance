"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "./FormComponents";
import { IoCheckmark } from "react-icons/io5";
import { useEffect, useState } from "react";

interface OptionType {
  name: string;
  action: () => void;
  image: string | StaticImageData;
}

interface propsType {
  cta?: string;
  options: OptionType[];
  active: string;
  classname?: string;
  children?: React.ReactNode;
  formatMintAddress: (address: string) => string; // Passing formatting function
}

const DropDownSelect = ({
  cta,
  options,
  active,
  classname,
  children,
  formatMintAddress, // Receive the formatting function
}: propsType) => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  useEffect(() => {
    const activeOption = options.find((option) => formatMintAddress(option.name) === active); // Use formatted address to find the active option
    if (activeOption) {
      setSelectedOption(activeOption);
    } else if (options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [active, options]);

  const toggleDropDown = () => {
    setShow((prev) => !prev);
  };

  const selectOption = (option: OptionType) => {
    setSelectedOption(option);
    option.action();
    toggleDropDown();
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-2 relative border-[#E5E7EB] border rounded-lg">
      <Button
        link={toggleDropDown}
        classname={classname + " flex items-center gap-2 mb-0"}
      >
        {selectedOption ? (
          <>
            <Image
              src={selectedOption.image}
              alt={selectedOption.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <p>{formatMintAddress(selectedOption.name)}</p>
          </>
        ) : (
          <p>{cta}</p>
        )}
        {children}
      </Button>

      {show && (
        <div
          className="bg-[#F9FAFB] min-w-[500px] overflow-x-hidden rounded-md absolute right-0 top-[3.5rem] z-30"
          style={{
            boxShadow: "0px 4px 80px 0px rgba(101, 119, 149, 0.20)",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 rounded-lg border-gray-300"
            />
          </div>

          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => selectOption(option)}
              className="p-4 flex gap-2 items-center hover:bg-background cursor-pointer"
            >
              <Image
                src={option.image}
                alt={option.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              {/* Show full mint address in dropdown items */}
              <p>{option.name}</p>
              {option.name === selectedOption?.name && (
                <IoCheckmark className="ml-auto" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDownSelect;
