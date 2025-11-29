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
    variant: 'LoginInput';
}


const Input = React.forwardRef<HTMLInputElement, InputProps>(function InputField(
        { label, value, onChange, type = 'text', placeholder, disable = false, className , ...props },
        ref: ForwardedRef<HTMLInputElement>
    ) {
        const id = useId();

        const variantClasses = {
            LoginInput: 'w-full px-4 py-2 text-sm text-text-300 border-b border-border-input focus:outline-none focus:border-b-border-input-focus dark:focus:border-b-border-input-focus-dark transition-border duration-400',
        }

        return <>
            <div className={cn("sm:col-span-3")}>
                {label && (
                    <label className={cn("block mb-2 text-sm font-medium text-gray-900")} htmlFor={id}>
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disable}
                    className={cn(`${variantClasses.LoginInput} ${className}`)}
                    ref={ref}
                    {...props}
                    id={id}
                />
            </div>
        </>
    });


export default Input;