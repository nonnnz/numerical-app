"use client";

import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import { SignInButton, useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { Spinner } from "@/components/spinner";

import { Button } from "@/components/ui/button";

export const Heading = () => {
    const { user } = useUser();
    const { isAuthenticated, isLoading } = useConvexAuth();
    return (
        <div className=" max-m-3xl space-y-4 h-full">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Welcome to <span
                className="underline">Numerical App</span>
            </h1>
            {isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href="">
                        isAuthenticated
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button>
                        NotAuthenticated
                        <ArrowRight className="h-4 w-4 ml-2"/>
                    </Button>
                </SignInButton>
            )}
        </div>
    )
}