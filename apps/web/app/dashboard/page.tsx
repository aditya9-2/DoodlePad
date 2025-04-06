/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import FooterSpotlight from '@/components/FooterSpotlight';
import CreateRoomDialog from '@/components/CreateRoomDialog';
import { HoverEffect } from '@/components/ui/card-hover-effect';
// import { BackgroundBeams } from '@/components/ui/background-beams';
import { useCanvasStore } from "@/store/atoms/useCanvasStore"
import { useEffect } from 'react';
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from 'react';

interface Canvas {
    id: string;
    title: string;
    description: string;
    link: string;
}

const Dashboard = () => {

    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [canvas, setCanvasesState] = useState<Canvas[]>([]);

    const canvases = useCanvasStore((state) => state.canvases);
    const setCanvases = useCanvasStore((state) => state.setCanvases);

    useEffect(() => {

        const getName = async () => {

            const token = localStorage.getItem("authToken");
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_URL}/api/v1/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data;
                setName(data.message);

            } catch (error) {
                console.error("Error fetching rooms:", error);
                setLoading(false);
            }

        }

        const fetchCanvases = async () => {
            const token = localStorage.getItem("authToken");
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_URL}/api/v1/user/all-rooms`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // @ts-ignore
                const rooms = response.data.map((room) => ({
                    id: room.id,
                    title: room.slug,
                    description: room.slug,
                    link: `/canvas/${room.id}`,
                }));

                setCanvases(rooms);
                setCanvasesState(rooms);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching rooms:", error);
                setLoading(false);
            }
        };

        getName();
        fetchCanvases();
    }, [setCanvases, setCanvasesState, canvas]);


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
                                Welcome Back, <span className="text-green-400">{name.split(" ")[0]}</span>
                            </h1>
                            <p className="text-muted-foreground max-w-lg">
                                Continue working on your canvases or create something new. Your creativity has no bounds.
                            </p>
                        </div>
                        <div className='cursor-pointer'>

                        </div>
                        <CreateRoomDialog />
                    </motion.div>
                </section>

                <section>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {/* Shadcn Skeleton loader */}
                            {[...Array(canvas.length || 4)].map((_, index) => (
                                <Skeleton key={index} className="h-48 rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <HoverEffect items={canvases} />
                    )}
                </section>


            </main>
            {/* <BackgroundBeams /> */}
            <FooterSpotlight />
        </div>
    );
};

export default Dashboard;