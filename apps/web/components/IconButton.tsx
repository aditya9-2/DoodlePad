import { ReactNode } from 'react'
interface inconBtnProps {
    icon: ReactNode;
    onClick: () => void;
    isActive: boolean
}

const IconButton = ({ icon, onClick, isActive }: inconBtnProps) => {
    return (
        <div className={`cursor-pointer rounded-xl border-[1px] p-2 border-gray-400 bg-black hover:opacity-70 ${isActive ? "text-blue-800" : "text-white"}`} onClick={onClick}>{icon}</div>
    )
}

export default IconButton