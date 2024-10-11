"use client"
import React, { useState } from 'react'
import { FormControl } from '../ui/form'
import { Input } from '../ui/input'
import { FaEye, FaEyeSlash } from 'react-icons/fa'


const PasswordInput = React.forwardRef<
    HTMLInputElement,
    React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className="relative">
            <FormControl>
                <Input type={isPasswordVisible ? "text" : "password"} placeholder="Enter your password" {...props} autoComplete='true' ref={ref} />
            </FormControl>
            <button type="button" className="h-full aspect-square grid place-content-center absolute top-0 right-0" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
        </div>
    )
})

PasswordInput.displayName = "PasswordInput"

export default PasswordInput