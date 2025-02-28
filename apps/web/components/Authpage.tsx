"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "./Button";
import PrimaryInput from "./PrimaryInput";
import { toast, Toaster } from "sonner";

interface AuthProp {
    isSignin: boolean;
}

const AuthPage = ({ isSignin }: AuthProp) => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        console.log(`name: ${name}`);
        console.log(`username: ${username}`);
        console.log(`password: ${password}`);


        if (!username || !password || (!isSignin && !name)) {
            setError("All fields are required.");
            setTimeout(() => {
                setError("")
            }, 1300);
            return;
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_HTTP_URL}/api/v1/user/${isSignin ? "signin" : "signup"}`;
            const payload = isSignin ? { username, password } : { name, username, password };

            const response = await axios.post(url, payload);
            const data = response.data;

            if (data) {
                toast.success("Authentication successful!", {
                    position: "bottom-right",
                    duration: 1500,
                    style: { backgroundColor: "green", color: "white" },
                });
            }

            if (isSignin && data.token) {
                localStorage.setItem("authToken", data?.token);
            }

            router.push(isSignin ? "/dashboard" : "/signin");
        } catch (err) {
            toast.error("Authentication failed!", {
                position: "bottom-right",
                duration: 1500,
                style: { backgroundColor: "red", color: "white" },
            });

            console.error("Caught error: ", err);
            setError("Failed to authenticate. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-6 justify-center items-center">
            <h1 className="text-xl font-bold text-center mb-6">
                {isSignin ? "Sign In" : "Sign Up"} here
            </h1>

            <div className="flex flex-col gap-4 rounded-xl w-[18rem]">
                {!isSignin && (
                    <PrimaryInput
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
                <PrimaryInput
                    type="text"
                    placeholder="Create a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <PrimaryInput
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="mt-4">
                <Button label={isSignin ? "Sign In" : "Sign Up"} onClick={handleSubmit} />
            </div>

            <p className="text-sm mt-4">
                {isSignin ? "Don't have an account? " : "Already have an account? "}
                <Link href={isSignin ? "/signup" : "/signin"} className="text-blue-500 font-semibold">
                    {isSignin ? "Signup here" : "Signin here"}
                </Link>
            </p>
            <Toaster />
        </div>
    );
};

export default AuthPage;
