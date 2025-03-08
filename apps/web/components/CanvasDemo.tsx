/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import * as LucidIcons from 'lucide-react';

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
                                    {[
                                        "PencilIcon",
                                        "EraserIcon",
                                        "ShapesIcon",
                                        "TextIcon",
                                        "UndoIcon"
                                    ].map((IconName, i) => {
                                        return (
                                            <div key={i} className="w-8 h-8 rounded-md bg-secondary/80 flex items-center justify-center">
                                                {/* @ts-ignore */}
                                                {React.createElement(LucidIcons[IconName as keyof typeof LucidIcons], { className: "w-5 h-5 text-primary" })}
                                            </div>
                                        );
                                    })}
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
                                        <div className="absolute top-[18rem] left-1/4 w-32 h-16 bg-primary/10 rounded-md border border-primary/30 flex items-center justify-center">
                                            <span className="text-sm font-medium">Feedback</span>
                                        </div>

                                        {/* Connecting arrows */}
                                        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M120,40 L200,120" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                                            <path d="M250,140 L280,200" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                                            <path d="M130,250 L100,80" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                                            <defs>
                                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                                                </marker>
                                            </defs>
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
                            <Link href="/signin">Start Collaborating</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CanvasDemo
