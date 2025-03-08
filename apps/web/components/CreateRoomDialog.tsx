"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from 'sonner';

export default function CreateRoomDialog() {
    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
                "http://localhost:8000/api/v1/user/room",
                { name: roomName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = response.data;
            console.log(data)

            if (response.status !== 201) {
                throw new Error(data.message || "Failed to create room");
            }

            setIsOpen(false);
            router.push(`/canvas/${data.roomId}`);
        } catch (error) {
            console.error("Error creating room:", error);
            if (error instanceof Error) {
                toast.error("Error: " + error.message, {
                    position: "bottom-right",
                    duration: 1500,
                    style: { backgroundColor: "red", color: "white" },
                });
            } else {
                toast.error("an unexpected error occured", {
                    position: "bottom-right",
                    duration: 1500,
                    style: { backgroundColor: "red", color: "white" },
                });
            }
        } finally {
            setLoading(false);
        }


    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Create New Room
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Room</DialogTitle>
                        <DialogDescription>
                            Create a new canvas room for collaboration. Fill in the details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="col-span-3"
                                placeholder="Physics Class 101"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                                placeholder="A room for physics diagrams and notes"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Room"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            <Toaster />
        </Dialog>
    );
}