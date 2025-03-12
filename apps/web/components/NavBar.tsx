"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NavBar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        const checkAuthStatus = () => {
            const token = localStorage.getItem('authToken')
            setIsSignedIn(!!token)
        }

        window.addEventListener('scroll', handleScroll)
        checkAuthStatus()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        setIsSignedIn(false)
        router.push('/')
    }

    const UserProfile = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center cursor-pointer">
                    <span className="text-primary-foreground font-bold text-xl">U</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

    const AuthSection = () => {
        if (isSignedIn) {
            return <UserProfile />
        }
        return (
            <div className="hidden md:flex items-center gap-3">
                <Button variant="outline" className="rounded-full px-5" asChild>
                    <Link href="/signin">Sign In</Link>
                </Button>
                <Button className="rounded-full px-5 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
        )
    }

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-10",
            isScrolled ? "bg-background/80 backdrop-blur-xl shadow-sm" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xl">D</span>
                        </div>
                        <span className="font-semibold text-xl hidden md:block">DoodlePad</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="flex-1 max-w-md mx-auto hidden md:block">
                    <ul className="flex justify-center space-x-6">
                        <li><a href="#features" className="nav-link">Features</a></li>
                        <li><a href="#how-it-works" className="nav-link">How it works</a></li>
                        {isSignedIn && <li><Link href="/dashboard" className="nav-link">Dashboard</Link></li>}
                    </ul>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <AuthSection />

                    {/* Hamburger Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-background shadow-md p-4">
                    <ul className="flex flex-col space-y-4">
                        <li><a href="#features" className="nav-link" onClick={() => setIsMenuOpen(false)}>Features</a></li>
                        <li><a href="#how-it-works" className="nav-link" onClick={() => setIsMenuOpen(false)}>How it works</a></li>
                        {!isSignedIn && (
                            <div className='flex flex-col gap-6 justify-center '>
                                <Button className='w-32'><Link href="/signin" onClick={() => setIsMenuOpen(false)}>Sign In</Link></Button>
                                <Button className='w-32'><Link href="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link></Button>
                            </div>
                        )}
                        {isSignedIn && (
                            <li className="text-red-500 cursor-pointer" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Logout</li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    )
}

export default NavBar
