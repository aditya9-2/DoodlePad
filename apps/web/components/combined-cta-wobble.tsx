import { WobbleCard } from "@/components/ui/wobble-card"
import Image from "next/image"

export function CombinedCTAWobble() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <WobbleCard containerClassName="bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full relative z-10">
                        <div className="col-span-1 lg:col-span-2">
                            <div className="text-left">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                    Ready to bring your ideas to life?
                                </h2>
                                <p className="text-muted-foreground text-lg mb-8">
                                    Join thousands of teams using DoodlePad to collaborate and create amazing visuals together.
                                </p>
                                <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 font-medium transition-colors">
                                    Get Started for Free
                                </button>
                            </div>
                        </div>
                        <div className="col-span-1 relative min-h-[200px]">
                            <Image
                                src="/placeholder.svg?height=300&width=300"
                                width={300}
                                height={300}
                                alt="Feature illustration"
                                className="absolute right-0 top-1/2 -translate-y-1/2 object-contain"
                            />
                        </div>
                    </div>
                </WobbleCard>
            </div>
        </section>
    )
}

