"use client"

import React from 'react'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full transition-all duration-300 hover:bg-secondary"
        >
            {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-500 rotate-0" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-500 rotate-0" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

export default ThemeToggle