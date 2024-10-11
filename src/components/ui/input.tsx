import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border text-black border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-orange-300 focus-visible:ring-offset-0 transition-shadow ease-linear duration-100",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <Input className={className}
        ref={ref}
        {...props}
        onChange={(e) => {
          const value = e.target.value;
          if (new RegExp(/^\d*$/).test(value)) {
            props?.onChange?.(e);
          }
        }}
      />
    )
  }
)
NumberInput.displayName = "NumberInput"

export { Input, NumberInput }
