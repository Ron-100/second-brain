import React, { useId, forwardRef } from 'react';
import { cn } from '../../utils';
import { IoIosArrowDown } from '../icons';

export type SelectOption = {
    value: string;
    label: string;
};

type SelectProps = {
    label?: string;
    options: SelectOption[];
    variant?: 'default' | 'ContentCreateSelect';
    className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    options,
    variant = 'default',
    className,
    ...props
}, ref) => {
    const id = useId();

    const baseSelectClasses = "w-full h-10 px-3 rounded-md text-sm outline-none transition-all cursor-pointer appearance-none";

    const variants = {
        default: "bg-white dark:bg-[#262626] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500",
        ContentCreateSelect: "bg-gray-50 dark:bg-[#262626] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
    };

    return (
        <div className="space-y-1">
            {label && (
                <label className={cn("text-xs font-medium text-gray-500 dark:text-gray-400 ml-1")} htmlFor={id}>
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    ref={ref}
                    className={cn(baseSelectClasses, variants[variant], className)}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                    <IoIosArrowDown />
                </div>
            </div>
        </div>
    );
});

export default Select;