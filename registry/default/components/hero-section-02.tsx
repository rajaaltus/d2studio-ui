"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FlameKindling, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { useState, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export default function HeroSection02() {
    return (
        <div className="@container w-full h-full flex flex-col min-h-screen bg-muted border-r border-dashed font-sans">
            <Header />
            <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-8 @md:py-12 @lg:py-16">
                <div className="flex flex-col items-center space-y-6 @md:space-y-8 @lg:space-y-12 text-center max-w-5xl w-full">
                    <div className="space-y-4 @md:space-y-6 flex flex-col items-center">
                        <Badge
                            variant="secondary"
                            className="px-3 py-1 text-xs @md:text-sm font-normal bg-blue-200/50 rounded-full ring ring-blue-400"
                        >
                            🚀 Limited seats available - Register Now
                        </Badge>
                        <h1 className="text-2xl max-w-prose font-bold tracking-tighter @sm:text-3xl @md:text-4xl @lg:text-5xl @xl:text-6xl px-4">
                            Launch
                            <span className="font-playfair italic text-[#E15D0B]">
                                {" "}
                                Your Enterprise{" "}
                            </span>
                            with Industry Leading Tools
                        </h1>
                        <p className="mx-auto max-w-3xl text-sm @md:text-base @lg:text-lg text-muted-foreground px-4 leading-relaxed">
                            Join thousands of successful founders and tech professionals.
                            Get Mentorship from industry experts, build real-world projects, and
                            earn university-recognized certificates.
                        </p>
                    </div>
                    <InfiniteSlider />
                    <div className="flex flex-col gap-3 @sm:flex-row w-full @sm:w-auto px-4 @sm:px-0">
                        <Button
                            size="lg"
                            className="h-[52px] text-sm @md:text-md font-semibold bg-[#1244E7] px-6 rounded-2xl border-[rgba(64,109,255,1)] border-2 hover:bg-[#1244E7]/90 w-full @sm:w-auto"
                        >
                            <FlameKindling className="mr-2" />
                            Register Bootcamp
                        </Button>
                    </div>
                    <SocialProof />
                    <Stats />
                </div>
            </main>
        </div>
    );
}

function Header() {
    const [open, setOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Career Guidance" },
        { href: "/", label: "Blog" },
        { href: "/", label: "About" },
    ];

    return (
        <header className="w-full relative flex flex-col bg-background mt-4 @md:mt-8 shadow-[0_4px_12px_0_rgba(0,0,0,0.01)]">
            <div className="w-full flex items-center justify-center h-[56px] @md:h-[64px] px-4 @lg:px-8 ">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-base @md:text-lg flex-shrink-0  min-w-1/3"
                    >
                        <div className="w-7 h-7 @md:w-8 @md:h-8 bg-foreground text-background flex items-center justify-center rounded-md text-xs @md:text-sm">
                            D2
                        </div>
                        <span>Studio</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden @lg:flex items-center space-x-4 @lg:space-x-6 text-sm  w-1/3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden @lg:flex items-center justify-end space-x-2 flex-shrink-0  w-1/3">
                        <Button variant="ghost" size="sm" className="hidden @lg:flex">
                            Sign in
                        </Button>
                        <Button variant="default" size="sm">
                            Book your seat
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="@lg:hidden flex-shrink-0"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "w-full overflow-hidden transition-all duration-300 ease-in-out @lg:hidden",
                    open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
                )}
            >
                <div className="border-t bg-background">
                    <nav className="container mx-auto flex flex-col px-4 py-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="py-3 text-base font-medium hover:text-foreground transition-colors border-b last:border-b-0"
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="container mx-auto flex flex-col gap-2 px-4 py-4 border-t">
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={() => setOpen(false)}
                        >
                            Book your seat
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setOpen(false)}
                        >
                            Sign in
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
    /**
     * Optional CSS class name to apply custom styles
     */
    className?: string;
    /**
     * Whether to reverse the animation direction
     * @default false
     */
    reverse?: boolean;
    /**
     * Whether to pause the animation on hover
     * @default false
     */
    pauseOnHover?: boolean;
    /**
     * Content to be displayed in the marquee
     */
    children: React.ReactNode;
    /**
     * Whether to animate vertically instead of horizontally
     * @default false
     */
    vertical?: boolean;
    /**
     * Number of times to repeat the content
     * @default 4
     */
    repeat?: number;
}

function Marquee({
    className,
    reverse = false,
    pauseOnHover = false,
    children,
    vertical = false,
    repeat = 4,
    ...props
}: MarqueeProps) {
    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
                {
                    "flex-row": !vertical,
                    "flex-col": vertical,
                },
                className,
            )}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
                            "animate-marquee flex-row": !vertical,
                            "animate-marquee-vertical flex-col": vertical,
                            "group-hover:[animation-play-state:paused]": pauseOnHover,
                            "[animation-direction:reverse]": reverse,
                        })}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}

const SLIDER_DATA = [
    {
        text: "500+ Partner Companies",
        image: "/registry/assets/company.png",
    },
    {
        text: "95% Success Rate",
        image: "/registry/assets/trophy.png",
    },
    {
        text: "100% Job placement",
        image: "/registry/assets/bag.png",
    },
    {
        text: "Universtity Certificates",
        image: "/registry/assets/certificate.png",
    },
    {
        text: "Live Project experience",
        image: "/registry/assets/desktop.png",
    },
    {
        text: "Industry expert Mentors",
        image: "/registry/assets/consulting.png",
    },
];

function InfiniteSlider() {
    return (
        <div className="w-full mt-4 @md:mt-8 relative">
            <Marquee pauseOnHover className="[--duration:40s]">
                {SLIDER_DATA.map((item, index) => (
                    <div
                        key={index}
                        className="w-44 @sm:w-52 @md:w-56 h-36 @sm:h-40 relative bg-background border-2 rounded-2xl @sm:rounded-3xl flex flex-col items-center justify-center text-white flex-shrink-0 p-3"
                    >
                        <div className="relative w-14 h-14 @sm:w-16 @sm:h-16 @md:w-20 @md:h-20">
                            <Image
                                src={item.image}
                                alt={item.text}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-xs @sm:text-sm @md:text-md font-medium mt-2 text-accent-foreground text-center text-wrap px-2">
                            {item.text}
                        </p>
                    </div>
                ))}
            </Marquee>
            <div className="absolute top-0 left-0 w-1/4 @sm:w-1/5 h-full bg-gradient-to-r from-muted to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-1/4 @sm:w-1/5 h-full bg-gradient-to-l from-muted to-transparent pointer-events-none"></div>
        </div>
    );
}

function SocialProof() {
    return (
        <div className="flex flex-col gap-3 px-4">
            <div className="flex flex-col @sm:flex-row items-center justify-center gap-3 @sm:gap-4">
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
                    <Avatar className="size-10 @sm:size-12">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar className="size-10 @sm:size-12">
                        <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
                        <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <Avatar className="size-10 @sm:size-12">
                        <AvatarImage
                            src="https://github.com/evilrabbit.png"
                            alt="@evilrabbit"
                        />
                        <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <Avatar className="size-10 @sm:size-12">
                        <AvatarImage
                            src="https://github.com/rajaaltus.png"
                            alt="@rajaaltus"
                        />
                        <AvatarFallback>FR</AvatarFallback>
                    </Avatar>
                    <Avatar className="size-10 @sm:size-12">
                        <AvatarImage
                            src="https://github.com/godwin159.png"
                            alt="@godwin159"
                        />
                        <AvatarFallback>GJ</AvatarFallback>
                    </Avatar>
                </div>
                <div className="px-3 py-2 rounded-full border shadow-inner text-xs @sm:text-sm">
                    ⭐ 4.9/5 Ratings
                </div>
            </div>
            <span className="text-center text-sm @sm:text-md text-muted-foreground">
                Trusted by 10,000+ students
            </span>
        </div>
    );
}

function Stats() {
    const stats = [
        { value: "99+", label: "Registration / day" },
        { value: "15+", label: "Top Tech Companies" },
        { value: "20+", label: "Industry Experts" },
        { value: "16+", label: "Years Combined Experience" },
    ];

    return (
        <div className="w-full mx-auto mt-8 @md:mt-12 @lg:mt-16 px-4">
            <div className="flex items-center justify-evenly gap-4 @sm:gap-6 @lg:gap-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="flex flex-col  items-start justify-center py-2"
                    >
                        <span className="text-2xl @sm:text-3xl @lg:text-3xl font-bold text-foreground">
                            {stat.value}
                        </span>
                        <span className="text-xs @sm:text-sm @md:text-md text-muted-foreground text-center mt-1">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
