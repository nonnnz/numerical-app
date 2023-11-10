import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({ 
    subsets: ["latin"],
    weight: ["400","600"]
});

export const Logo = () => {
    return (
        <div className="flex items-center gap-x-2">
            <Image
                src="/logo-full-light.svg"
                height="40"
                width="40"
                alt="full logo"
                className="dark:hidden"
            />
            <Image
                src="/logo-full-dark.svg"
                height="40"
                width="40"
                alt="full logo"
                className="hidden dark:block"
            />
            <p className={cn("font-semibold", font.className, "hidden md:block")} style={{ whiteSpace: 'nowrap' }}>
                Numerical App
            </p>
        </div>
    )
}