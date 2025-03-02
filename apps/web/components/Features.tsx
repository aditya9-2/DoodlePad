"use client"

import React from 'react'
import { Users, PenTool, Lightbulb, Lock, Icon } from "lucide-react"

interface FeatureCardProps {


    icon: React.ForwardRefExoticComponent<Omit<unknown, "ref"> & React.RefAttributes<SVGSVGElement>>
    title: string;
    description: string;
    delay: number;

}
const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => (
    <div
        className="glass-card p-6 rounded-xl opacity-0 animate-scale-in"
        style={{ animationDelay: `${delay}s` }}
    >
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-5">
            <Icon className="h-6 w-6" iconNode={[]} />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
)

const Features = () => {
    const features = [
        {
            icon: Users,
            title: "Real-time Collaboration",
            description: "Work together with your team in real-time, with changes synced instantly across all devices.",
            delay: 0.2
        },
        {
            icon: PenTool,
            title: "Intuitive Drawing Tools",
            description: "Simple yet powerful drawing tools that anyone can use to visualize ideas efficiently.",
            delay: 0.3
        },
        {
            icon: Lightbulb,
            title: "Unlimited Canvases",
            description: "Create as many canvases as you need, organized in spaces for different projects and teams.",
            delay: 0.4
        },
        {
            icon: Lock,
            title: "Secure Sharing",
            description: "Control who can view and edit your canvases with flexible permission settings.",
            delay: 0.5
        }
    ]

    return (
        <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-14 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary-foreground text-sm font-medium mb-4">
                        Features
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Everything you need to bring ideas to life
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        DoodlePad combines powerful tools with simplicity to help teams visualize and communicate effectively.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/5 rounded-full -z-10"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/5 rounded-full -z-10"></div>
        </section>
    )
}

export default Features