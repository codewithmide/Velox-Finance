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
  formatMintAddress,
}: propsType) => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  useEffect(() => {
    const activeOption = options.find(
      (option) => formatMintAddress(option.name) === active
    );
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
    <div className="relative rounded-lg">
      <Button
        link={toggleDropDown}
        classname={
          classname +
          " flex items-center gap-2 mb-0 rounded-[24px] bg-[#4F4F4F] active-tab md:w-[140px] w-[100px]"
        }
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
            <p className="md:text-sm text-[10px]">{formatMintAddress(selectedOption.name)}</p>
            <div className="ml-1 center">
              <Image src="/icon/down.png" alt="down" width={14} height={14} />
            </div>
          </>
        ) : (
          <>
            <p className="md:text-sm text-[10px]">{cta}</p>
            <Image src="/icon/down.png" alt="down" width={14} height={14} />
          </>
        )}
        {children}
      </Button>

      {show && (
        <div
          className="bg-[#2C2C2C] md:min-w-[530px] overflow-x-hidden rounded-[24px] p-2 absolute right-0 top-[4rem] z-30"
          style={{
            boxShadow: "0px 4px 80px 0px rgba(101, 119, 149, 0.20)",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <div className="my-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full p-3 text-sm rounded-2xl bg-[#404040] outline-none"
            />
          </div>

          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => selectOption(option)}
              className="p-4 flex gap-2 items-center hover:bg-[#404040] hover:rounded-2xl bg-[#2C2C2C] cursor-pointer"
            >
              <Image
                src={option.image}
                alt={option.name}
                width={20}
                height={20}
                className="rounded-full"
              />
              <p className="text-sm">{option.name}</p>
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
