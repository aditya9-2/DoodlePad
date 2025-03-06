"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Spotlight } from './ui/Spotlight'

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="blue"
            />
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/50 dark:bg-secondary/20 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="absolute top-20 right-10 w-20 h-20 bg-primary/10 rounded-full floating-element -z-10 opacity-70"></div>
            <div className="absolute bottom-40 left-20 w-32 h-32 bg-primary/10 rounded-full floating-element -z-10 opacity-70" style={{ animationDelay: '1s' }}></div>

            <div className="container px-4 mx-auto max-w-6xl">
                <div className="text-center mb-10 md:mb-16 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <span className="inline-block py-1 px-3 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
                        Collaborative Canvas
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
                        Create, Collaborate, and <span className="highlight-text">Visualize</span> Together
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-8">
                        DoodlePad turns your ideas into beautiful visual collaborations in real-time. Draw, plan, and create together from anywhere.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="rounded-full px-6 py-6 gap-2 text-base" asChild>
                            <Link href="/signup">
                                Start Creating <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Canvas Preview */}
                <div className="relative max-w-4xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="aspect-video overflow-hidden rounded-xl border border-border shadow-2xl">
                        <div className="w-full h-full bg-card relative p-4">
                            {/* Canvas UI Header */}
                            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">JD</div>
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">SK</div>
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">+3</div>
                                </div>
                            </div>

                            {/* Canvas Content */}
                            <div className="h-full w-full bg-secondary/50 rounded-lg flex items-center justify-center">
                                {/* Drawing Elements */}
                                <div className="relative w-full h-full">
                                    <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-md border-2 border-primary rotate-3"></div>
                                    <div className="absolute bottom-1/4 right-1/3 w-32 h-32 rounded-full border-2 border-primary/70"></div>
                                    <div className="absolute top-1/3 right-1/4 w-60 h-24 rounded-md border-2 border-primary/80 -rotate-6"></div>
                                    <div className="absolute top-1/2 left-1/3 w-10 h-10 bg-primary/20 rounded-sm animate-pulse-subtle"></div>
                                    {/* Add connecting lines */}
                                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                        <line x1="30%" y1="30%" x2="60%" y2="40%" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                                        <line x1="65%" y1="40%" x2="70%" y2="60%" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Canvas reflection */}
                    <div className="h-20 w-full bg-gradient-to-b from-background/90 to-transparent -mt-4 relative -z-10 mx-auto opacity-50 backdrop-blur-sm"></div>
                </div>
            </div>

            <div className="hero-gradient"></div>
        </section>
    )
}

export default Hero
