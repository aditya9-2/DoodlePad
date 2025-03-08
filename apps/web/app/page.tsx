"use client"

import React from "react"
import NavBar from "@/components/NavBar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import CanvasDemo from "@/components/CanvasDemo"
import Footer from "@/components/Footer"
import { CTASection } from "@/components/cta-section"



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



      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}



