"use client"

import React from 'react'
// import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const Footer = () => {
    return (
        <footer className="border-t border-border py-12 mt-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Logo and info */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">D</span>
                            </div>
                            <span className="font-semibold text-lg">DoodlePad</span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                            Creating the best collaborative experience for teams to visualize ideas together.
                        </p>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <span className="text-sm text-muted-foreground">
                                {new Date().getFullYear()} DoodlePad
                            </span>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            {["Features", "Pricing", "Templates", "Integrations", "Updates"].map((item, index) => (
                                <li key={index}>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {["Documentation", "Tutorials", "Blog", "Community", "Support"].map((item, index) => (
                                <li key={index}>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            {["About", "Careers", "Privacy Policy", "Terms of Service", "Contact"].map((item, index) => (
                                <li key={index}>
                                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <p className='text-center mt-6'>made by <span className='text-green-500'>Aditya</span></p>
            </div>
        </footer>
    )
}

export default Footer