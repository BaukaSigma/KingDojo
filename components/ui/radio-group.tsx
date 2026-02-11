"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
}

const RadioGroupContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
}>({});

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className, value, onValueChange, defaultValue, children, ...props }, ref) => {
        const [internalValue, setInternalValue] = React.useState(defaultValue || "");

        const currentValue = value !== undefined ? value : internalValue;

        const handleValueChange = (newValue: string) => {
            if (value === undefined) {
                setInternalValue(newValue);
            }
            onValueChange?.(newValue);
        };

        return (
            <RadioGroupContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
                <div className={cn("grid gap-2", className)} ref={ref} {...props}>
                    {children}
                </div>
            </RadioGroupContext.Provider>
        );
    }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
    ({ className, value, ...props }, ref) => {
        const context = React.useContext(RadioGroupContext);
        const isChecked = context.value === value;

        return (
            <button
                type="button"
                role="radio"
                aria-checked={isChecked}
                data-state={isChecked ? "checked" : "unchecked"}
                value={value}
                className={cn(
                    "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    "flex items-center justify-center", // Center the indicator
                    isChecked ? "border-primary" : "border-neutral-400",
                    className
                )}
                onClick={() => context.onValueChange?.(value)}
                ref={ref}
                {...props}
            >
                {isChecked && (
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                )}
            </button>
        );
    }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
