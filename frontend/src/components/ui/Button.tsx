import React from 'react';
import { cn } from '../../utils';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant: 'primary' | 'secondary' | 'delete'| 'twich';
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = (props) => {

    const baseClasses = 'cursor-pointer';

    const variantClasses = {
        primary: 'text-blue-700 hover:text-white border border-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800',
        secondary: 'text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-gray-400 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800',
        delete: 'text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-500 dark:focus:ring-red-800',
        twich: 'transition-all duration-200 w-[100%] h-10 text-[14px] text-white bg-black dark:bg-white dark:text-[#171717] text-white border-b rounded-sm active:scale-95 active:border active:bg-transparent active:text-white',
    }

    return (
        <>
            <button
                onClick={props.onClick}
                type="submit"
                disabled={props.disabled}
                className={cn(`${baseClasses} ${variantClasses[props.variant]} ${props.className} ${props.disabled && 'opacity-50 cursor-not-allowed '}`)}
            >
                {props.children}
            </button>
        </>
    )
}

export default Button;