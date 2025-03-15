import React, { ReactNode } from 'react'
interface buttonProps {
    label: ReactNode;
    onClick?: () => void;
    className?: string;
}
const Button = ({ label, onClick, className }: buttonProps) => {
    return (
        <div>
            <button className={`p-4 py-2 text-black font-semibold  w-[10em] bg-primary rounded-md ${className}`}
                onClick={onClick}>{label}</button>
        </div>
    )
}

export default Button