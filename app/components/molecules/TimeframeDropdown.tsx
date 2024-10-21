"use client";

import { useState, useEffect } from "react";
import { Button } from "./FormComponents";
import { IoCheckmark } from "react-icons/io5";

interface TimeframeOption {
  name: string;
  action: () => void;
}

interface TimeframeSelectProps {
  cta?: string;
  options: TimeframeOption[];
  active: string;
  classname?: string;
}

const TimeframeSelect = ({
  cta,
  options,
  active,
  classname,
}: TimeframeSelectProps) => {
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TimeframeOption | null>(null);

  useEffect(() => {
    const activeOption = options.find((option) => option.name === active);
    if (activeOption) {
      setSelectedOption(activeOption);
    } else if (options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [active, options]);

  const toggleDropDown = () => {
    setShow((prev) => !prev);
  };

  const selectOption = (option: TimeframeOption) => {
    setSelectedOption(option);
    option.action();
    toggleDropDown();
  };

  return (
    <div className="relative rounded-lg">
      <Button
        link={toggleDropDown}
        classname={
          classname +
          "flex items-center gap-2 mb-0 rounded-[24px] bg-[#4F4F4F] active-tab md:w-[100px] w-[80px]"
        }
      >
        {selectedOption ? (
          <>
            <p className="md:text-sm text-[10px]">{selectedOption.name}</p>
            <div className="ml-1 center">
              <img src="/icon/down.png" alt="down" width={14} height={14} />
            </div>
          </>
        ) : (
          <>
            <p className="md:text-sm text-[10px]">{cta}</p>
            <img src="/icon/down.png" alt="down" width={14} height={14} />
          </>
        )}
      </Button>

      {show && (
        <div
          className="bg-[#2C2C2C] min-w-[300px] overflow-x-hidden rounded-[24px] p-2 absolute right-0 top-[4rem] z-30"
          style={{
            boxShadow: "0px 4px 80px 0px rgba(101, 119, 149, 0.20)",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => selectOption(option)}
              className="p-4 flex gap-2 items-center hover:bg-[#404040] hover:rounded-2xl bg-[#2C2C2C] cursor-pointer"
            >
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

export default TimeframeSelect;
