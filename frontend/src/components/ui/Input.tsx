import React, { useId, type ForwardedRef } from "react";
import { cn } from "../../utils";


type InputProps = {
    label?: string;
    value?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disable?: boolean;
    type?: string;
    className?:string;
    variant: 'LoginInput' | 'ContentCreateInput';
}


const Input = React.forwardRef<HTMLInputElement, InputProps>(function InputField(
        { label, value, onChange, type = 'text', placeholder, disable = false, className , ...props },
        ref: ForwardedRef<HTMLInputElement>
    ) {
        const id = useId();

        const variantClasses = {
            LoginInput: 'w-full px-4 py-2 text-sm text-text-300 border-b border-black/15 dark:border-white/15 focus:outline-none focus:border-b-border-input-focus dark:focus:border-b-border-input-focus-dark transition-border duration-400',
            ContentCreateInput: 'w-full px-4 py-2 text-sm text-text-300 bg-gray-50 dark:bg-[#262626] border-b border-black/15 dark:border-white/15 focus:outline-none focus:border-b-border-input-focus dark:focus:border-b-border-input-focus-dark transition-border duration-400',
        }

        return <>
            <div className={cn("sm:col-span-3")}>
                {label && (
                    <label className={cn("text-xs font-medium text-gray-500 dark:text-gray-400 ml-1")} htmlFor={id}>
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disable}
                    className={cn(`${variantClasses[props.variant]} ${className}`)}
                    ref={ref}
                    {...props}
                    id={id}
                />
            </div>
        </>
    });


export default Input;