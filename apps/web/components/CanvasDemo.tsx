"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const CanvasDemo = () => {
    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    {/* Left side: Canvas Demo */}
                    <div className="flex-1 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="relative rounded-xl overflow-hidden border border-border shadow-lg">
                            <div className="aspect-[4/3] bg-secondary/30 relative overflow-hidden">
                                {/* Canvas Tools */}
                                <div className="absolute left-0 top-0 bottom-0 w-12 bg-card border-r border-border flex flex-col items-center py-4 gap-4">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-md bg-secondary/80"></div>
                                    ))}
                                </div>

                                {/* Canvas Content */}
                                <div className="absolute inset-0 ml-12">
                                    {/* Sample diagram */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%]">
                                        {/* Flow diagram boxes */}
                                        <div className="absolute top-0 left-1/4 w-32 h-16 bg-primary/10 rounded-md border border-primary/30 flex items-center justify-center">
                                            <span className="text-sm font-medium">Ideation</span>
                                        </div>
                                        <div className="absolute top-1/3 left-1/2 w-32 h-16 bg-primary/10 rounded-md border border-primary/30 flex items-center justify-center">
                                            <span className="text-sm font-medium">Design</span>
                                        </div>
                                        <div className="absolute top-2/3 right-1/4 w-32 h-16 bg-primary/10 rounded-md border border-primary/30 flex items-center justify-center">
                                            <span className="text-sm font-medium">Development</span>
                                        </div>
                                        <div className="absolute bottom-0 left-1/3 w-32 h-16 bg-primary/10 rounded-md border border-primary/30 flex items-center justify-center">
                                            <span className="text-sm font-medium">Feedback</span>
                                        </div>

                                        {/* Connecting arrows */}
                                        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M120,40 L200,120" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                                            <path d="M250,140 L280,200" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                                            <path d="M240,220 L150,240" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                                            <path d="M130,250 L100,80" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                                            <defs>
                                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                                                </marker>
                                            </defs>
                                        </svg>
                                    </div>

                                    {/* Cursor animation */}
                                    <div className="absolute w-5 h-5 animate-float" style={{ top: '40%', left: '60%', animationDelay: '0.5s' }}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.29289 1.29289C5.47386 1.11193 5.72386 1.01866 5.97121 1.04466C6.21856 1.07066 6.44293 1.21587 6.58579 1.43934L15.5858 15.4393C15.7401 15.6822 15.7703 15.9809 15.6678 16.2481C15.5652 16.5153 15.341 16.7223 15.0682 16.8023L11.0682 17.8023C10.752 17.8939 10.4126 17.8418 10.1382 17.6624C9.86387 17.4829 9.68491 17.1968 9.65811 16.8813L9.00811 9.03131L2.43934 2.46254C2.24777 2.27097 2.14583 2.01068 2.16061 1.74582C2.1754 1.48095 2.30564 1.23456 2.51823 1.06479C2.73083 0.895014 3.00386 0.822906 3.2697 0.866345L9.2697 1.86635C9.53339 1.90953 9.76802 2.05556 9.92455 2.27012L5.29289 1.29289Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Users */}
                                <div className="absolute top-4 right-4 flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium">JD</div>
                                    <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium">TK</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Text */}
                    <div className="flex-1 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-sm font-medium mb-4">
                            How it works
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                            Turn complex ideas into clear visuals
                        </h2>
                        <p className="text-muted-foreground text-lg mb-6">
                            DoodlePad helps teams communicate visually in real-time. Create flowcharts, diagrams, wireframes, and more with our intuitive tools.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Join a canvas with a simple shared link",
                                "Draw, type, and add shapes with easy-to-use tools",
                                "See others' cursors and changes in real-time",
                                "Export your work in multiple formats"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Button className="rounded-full px-6" asChild>
                            <Link href="/signup">Start Collaborating</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CanvasDemo
