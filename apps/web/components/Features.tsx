"use client"

import { Users, PenTool, Lightbulb, Lock, type LucideIcon } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    description: string
    delay: number
}

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => (
    <div className="min-h-[14rem] opacity-0 animate-scale-in" style={{ animationDelay: `${delay}s` }}>
        <div className="relative h-full rounded-2.5xl border p-2 md:rounded-3xl md:p-3">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
            <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
                <div className="relative flex flex-1 flex-col justify-between gap-3">
                    <div className="w-fit rounded-lg bg-secondary p-2">
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance">
                            {title}
                        </h3>
                        <p className="font-sans text-sm/[1.125rem] md:text-base/[1.375rem] text-muted-foreground">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const Features = () => {
    const features = [
        {
            icon: Users,
            title: "Real-time Collaboration",
            description: "Work together with your team in real-time, with changes synced instantly across all devices.",
            delay: 0.2,
        },
        {
            icon: PenTool,
            title: "Intuitive Drawing Tools",
            description: "Simple yet powerful drawing tools that anyone can use to visualize ideas efficiently.",
            delay: 0.3,
        },
        {
            icon: Lightbulb,
            title: "Unlimited Canvases",
            description: "Create as many canvases as you need, organized in spaces for different projects and teams.",
            delay: 0.4,
        },
        {
            icon: Lock,
            title: "Secure Sharing",
            description: "Control who can view and edit your canvases with flexible permission settings.",
            delay: 0.5,
        },
    ]

    return (
        <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-14 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 dark:text-primary-light text-primary-dark">
                        Features
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-primary">
                        Everything you need to bring ideas to life
                    </h2>
                    <p className="text-secondary text-lg max-w-xl mx-auto">
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

