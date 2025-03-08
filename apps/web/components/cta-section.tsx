import { WobbleCard } from "@/components/ui/wobble-card"

export function CTASection() {
    return (
        <section className="py-20">
            <div className="mx-auto px-4 max-w-6xl">
                <WobbleCard containerClassName="bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl  text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to bring your ideas to life?</h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                            Join thousands of teams using DoodlePad to collaborate and create amazing visuals together.
                        </p>
                        <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 font-medium transition-colors">
                            Get Started for Free
                        </button>
                    </div>
                </WobbleCard>
            </div>
        </section>
    )
}

