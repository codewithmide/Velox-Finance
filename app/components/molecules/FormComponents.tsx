"use client";

import classnames from "@/app/utils/classnames";
import Image from "next/image";
import { useEffect, useState, useRef, ReactNode } from "react";

type ButtonPropsType = {
  link: (e?: any) => void;
  cta?: string; // Optional CTA text
  children?: ReactNode; // Use children for complex JSX
  loading?: boolean;
  classname?: string;
  validation?: boolean;
};

export const Button: React.FC<ButtonPropsType> = ({
  link,
  cta,
  children,
  loading = false,
  classname,
  validation,
}) => {
  return (
    <button
      onClick={link}
      type="button"
      className={classnames(
        "p-3  flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed",
        classname
      )}
      disabled={loading || validation}
    >
      {loading ? (
        <span className="loading-indicator">{children}</span>
      ) : (
        <>
          {cta}
          {children && !cta ? children : null}
        </>
      )}
    </button>
  );
};

interface InputProps {
  onChange: (e: any) => void;
  classname?: string;
  label?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  preIcon?: any;
  postIcon?: any;
  postIconAction?: (e: any) => void;
  buttonClassnames?: any;
  isChecked?: boolean;
  imageClassname?: string;
  dropdownList?: string[];
  selected?: string[];
  selectItem?: (item: string) => void;
  showSearch?: boolean;
}

export const Input = ({
  classname,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  postIcon = false,
  postIconAction,
  preIcon = false,
  isChecked,
  imageClassname,
  buttonClassnames,
  dropdownList,
  selected,
  selectItem,
  showSearch = true,
}: InputProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilterData] = useState(
    dropdownList ? dropdownList : []
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setFilterData(dropdownList ? dropdownList : []);
  }, [dropdownList]);

  const toggleModal = () => {
    setIsModalVisible(isModalVisible ? false : true);
  };

  const onSearch = (e: any) => {
    setSearchQuery(e.target.value);
    if (dropdownList) {
      setFilterData(
        dropdownList?.filter((item: string) =>
          item.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
        )
      );
    }
  };

  if (type === "checkbox") {
    return (
      <div className="flex items-center ">
        <input
          type={"checkbox"}
          id="myCheckbox"
          className="form-checkbox checked:bg-brand text-[#BFBEBE]"
          onChange={onChange}
          checked={isChecked}
        />

        {label && <small className="ml-2 text-sm font-medium">{label}</small>}
      </div>
    );
  }

  return (
    <div className={classnames("flex flex-col gap-2 w-full", classname)}>
      {label && (
        <small className="md:text-[16px] text-[#9CA3AF]">{label}</small>
      )}

      <div className="flex items-center input-wrapper outline-none text-4xl rounded-lg focus:outline-none ">
        {preIcon && <Image className="h-4 w-4 ml-3" src={preIcon} alt="" />}
        <input
          type={type}
          id={label}
          className="focus:outline-none focus:bg-none py-2 bg-transparent w-full rounded-lg text-white text-xl md:text-4xl"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
        />
        {postIcon && (
          <button
            className={classnames("", buttonClassnames)}
            onClick={postIconAction}
          >
            <Image
              className={classnames("h-4 w-4 mr-3", imageClassname)}
              src={postIcon}
              alt=""
            />
          </button>
        )}
      </div>
    </div>
  );
};