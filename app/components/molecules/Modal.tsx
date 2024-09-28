import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import { VscClose } from "react-icons/vsc";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-[1.8rem] font-semibold"
          onClick={onClose}
        >
          <VscClose />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
