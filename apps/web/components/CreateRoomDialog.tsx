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

export default function CreateRoomDialog() {
    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // This is where you'll integrate with your backend API
        // For now, we'll just simulate room creation by redirecting
        const mockRoomId = Math.random().toString(36).substr(2, 9);

        // TODO: Replace with actual API call
        // const response = await fetch('/api/rooms', {
        //   method: 'POST',
        //   body: JSON.stringify({ name: roomName, description }),
        // });
        // const data = await response.json();

        setIsOpen(false);
        router.push(`/canvas/${mockRoomId}`);
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
                        <Button type="submit">Create Room</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}