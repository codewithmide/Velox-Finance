"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "./FormComponents";
import { IoCheckmark } from "react-icons/io5";
import { useState } from "react";

interface OptionType {
  name: string;
  action: () => void;
  image: string | StaticImageData;
}

interface propsType {
  cta?: string;
  options: OptionType[]; // Update to match the new OptionType
  active: string;
  classname?: string;
  children?: any;
}

const DropDownSelect = ({ cta, options, active, classname, children }: propsType) => {
  const [show, setShow] = useState(false);

  function toggleDropDown() {
    setShow(prev => !prev);
  }

  function selectOption(option: OptionType) {
    option.action();
    toggleDropDown();
  }

  const activeOption = options.find(option => option.name === active);

  return (
    <div className="relative border-[#E5E7EB] border rounded-lg">
      <Button link={toggleDropDown} classname={classname + " flex items-center gap-2 mb-0"}>
        {/* Display the active option's image next to the name */}
        {activeOption && (
          <>
            <Image src={activeOption.image} alt={activeOption.name} width={24} height={24} className="rounded-full" />
            <p>{activeOption.name || cta}</p>
          </>
        )}
        {children}
      </Button>

      {show && (
        <div
          className="w-40 bg-[#F9FAFB] rounded-md absolute right-0 top-[3.5rem] z-30"
          style={{ boxShadow: "0px 4px 80px 0px rgba(101, 119, 149, 0.20)" }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => selectOption(option)}
              className="p-4 flex gap-2 items-center hover:bg-background cursor-pointer"
            >
              {/* Display the image in the dropdown item */}
              <Image src={option.image} alt={option.name} width={24} height={24} className="rounded-full" />
              <p>{option.name}</p>
              {option.name === active && <IoCheckmark className="ml-auto" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDownSelect;
