"use client"

import React from "react"
import NavBar from "@/components/NavBar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import CanvasDemo from "@/components/CanvasDemo"
import Footer from "@/components/Footer"


export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* Navigation */}
      <NavBar />


      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Canvas Demo Section */}
      <CanvasDemo />

      {/* Testimonials Section (simplified) */}
      <section id="testimonials" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
            Loved by teams worldwide
          </h2>
          <div className="max-w-2xl mx-auto bg-background rounded-lg p-8 glass-card">
            <p className="text-lg italic mb-6">
              {"DoodlePad has completely transformed how our team collaborates on visual projects. The real-time collaboration is seamless and the interface is incredibly intuitive."}
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary"></div>
              <div className="text-left">
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-muted-foreground text-sm">Product Manager at Acme Inc</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full"></div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 relative z-10">
              Ready to bring your ideas to life?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto relative z-10">
              Join thousands of teams using DoodlePad to collaborate and create amazing visuals together.
            </p>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 font-medium transition-colors relative z-10">
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
