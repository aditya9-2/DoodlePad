"use client"
import { ThemeProvider } from "@/components/theme-provider"
import { ReactNode } from "react"

export const Providers = ({ children }: { children: ReactNode }) => {

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {children}

        </ThemeProvider>
    )

}