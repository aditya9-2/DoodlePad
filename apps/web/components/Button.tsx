import React from 'react'
interface buttonProps {
    label: string | number;
}
const Button = ({ label }: buttonProps) => {
    return (
        <div>
            <button className="p-4 py-2 text-black font-semibold bg-gradient-to-l w-[10em] from-slate-300 bg-slate-200 rounded-md">{label}</button>
        </div>
    )
}

export default Button