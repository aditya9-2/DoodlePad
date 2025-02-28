import React, { ReactNode } from 'react'

interface propTypes {
    type: string;
    placeholder: string;
    onClick?: () => void;
}

const PrimaryInput = ({ type, placeholder }: propTypes): ReactNode => {
    return (
        <div className="flex flex-col gap-8 rounded-xl">
            <input className="rounded-lg px-4 py-2 bg-transparent border-[1px] border-gray-300 outline-none" type={type} placeholder={placeholder} />
        </div>
    )
}

export default PrimaryInput