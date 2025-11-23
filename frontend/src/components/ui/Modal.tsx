import React from "react";
import { cn } from "../../utils";


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return ( 
        <div onClick={handleBackdropClick} className={cn("absolute z-90 w-screen h-screen inset-0 bg-modal-background dark:bg-modal-background-dark backdrop-blur-sm flex justify-center items-center cursor-default")}>
            <div className={cn("flex justify-center items-center")}>
                {children}
            </div>
        </div>
    )
}

export default Modal;