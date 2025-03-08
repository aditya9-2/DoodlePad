"use client"
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import FooterSpotlight from '@/components/FooterSpotlight';
import CreateRoomDialog from '@/components/CreateRoomDialog';
import { HoverEffect } from '@/components/ui/card-hover-effect';

const Dashboard = () => {


    const canvases = [
        {
            id: '1',
            title: 'Physics Drawing',
            description: 'Explore visualizations for mechanics, waves, and thermodynamics. Tap to start creating.',
            link: '/canvas/1'
        },
        {
            id: '2',
            title: 'Chemistry Drawing',
            description: 'Create molecular structures, chemical reactions, and lab setups with precision tools.',
            link: '/canvas/2'
        },
        {
            id: '3',
            title: 'Computer Architecture',
            description: 'Design circuit diagrams, memory layouts, and system flowcharts with specialized tools.',
            link: '/canvas/3'
        },
    ];


    return (
        <div className="relative overflow-hidden flex flex-col min-h-screen bg-gradient-to-b from-background to-background/90">
            <NavBar />

            <main className="flex-grow pt-24 px-6 max-w-7xl mx-auto w-full">
                <section className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                        <div>
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary mb-3 text-xs font-medium">
                                Your Workspace
                            </div>
                            <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
                                Welcome Back, <span className="text-green-400">Aditya</span>
                            </h1>
                            <p className="text-muted-foreground max-w-lg">
                                Continue working on your canvases or create something new. Your creativity has no bounds.
                            </p>
                        </div>

                        <CreateRoomDialog />

                    </motion.div>
                </section>

                <section>
                    <HoverEffect items={canvases} />
                </section>


            </main>

            <FooterSpotlight />
        </div>
    );
};

export default Dashboard;