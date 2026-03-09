"use client"

import * as React from "react"
import { ArrowUp, Command, Plus, Settings2, FileUp } from "lucide-react"
import { IconSparkle, IconBadgeSparkle, IconBookOpen } from "nucleo-glass"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Custom Feather Icon (Glass Theme per User SVG)
const CustomFeatherIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <g clipPath="url(#clip_feather_v5)">
            <mask
                id="mask0_feather_v5"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={16}
                height={16}
            >
                <path d="M16 0H0V16H16V0Z" fill="white" />
                <path
                    d="M14.6642 1.98546C14.6297 1.59261 14.2781 1.30002 13.8904 1.33629C6.92457 1.94572 3.77546 6.67805 2.38509 10.1492C2.25488 10.4743 2.41259 10.839 2.73281 10.9807L3.45408 11.2999C4.21889 11.6393 4.97035 11.7898 5.01473 11.7974C5.82799 11.9459 6.57975 12.0206 7.26923 12.0206C8.7043 12.0206 9.86877 11.6981 10.7449 11.0581C11.0978 10.7999 11.6694 10.2834 12.0684 9.40252C9.3723 9.90998 8.6699 7.98705 8.6699 7.98705C10.75 8.51345 13.1154 8.67532 13.749 6.24319C13.8814 5.66031 13.9657 5.09615 14.0466 4.55145L14.0494 4.53303C14.1769 3.68201 14.297 2.88039 14.5702 2.40305C14.6408 2.28064 14.6774 2.13687 14.6642 1.98546Z"
                    fill="black"
                />
            </mask>
            <g mask="url(#mask0_feather_v5)">
                <path
                    d="M9.2762 4.03112C9.59786 3.9286 9.9516 4.08408 10.0893 4.40026C10.2362 4.73784 10.0812 5.13094 9.7436 5.27786L9.4858 5.3931C6.8392 6.60099 4.85102 8.39239 3.93372 10.2903C3.86962 10.4227 3.76681 10.5237 3.64596 10.5878L3.64271 10.5962C2.97658 12.2426 2.72646 13.6218 2.6694 14.0949L2.65768 14.1627C2.58352 14.4923 2.26987 14.7189 1.92721 14.6776C1.56188 14.6334 1.30115 14.3009 1.34518 13.9354L1.3849 13.6581C1.50507 12.9024 1.83249 11.4193 2.55677 9.73619L2.58737 9.67499C2.65906 9.54626 2.76864 9.44839 2.89596 9.39112C4.07756 7.19792 6.37433 5.2897 9.21173 4.0552L9.2762 4.03112Z"
                    fill="url(#paint0_feather_v5)"
                />
            </g>
            <mask
                id="mask1_feather_v5"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x={2}
                y={1}
                width={13}
                height={12}
            >
                <path
                    d="M14.6642 1.98546C14.6297 1.59261 14.2781 1.30002 13.8904 1.33629C6.92457 1.94572 3.77546 6.67805 2.38509 10.1492C2.25488 10.4743 2.41259 10.839 2.73281 10.9807L3.45408 11.2999C4.21889 11.6393 4.97035 11.7898 5.01473 11.7974C5.82799 11.9459 6.57975 12.0206 7.26923 12.0206C8.7043 12.0206 9.86877 11.6981 10.7449 11.0581C11.0978 10.7999 11.6694 10.2834 12.0684 9.40252C9.3723 9.90998 8.6699 7.98705 8.6699 7.98705C10.75 8.51345 13.1154 8.67532 13.749 6.24319C13.8814 5.66031 13.9657 5.09615 14.0466 4.55145L14.0494 4.53303C14.1769 3.68201 14.297 2.88039 14.5702 2.40305C14.6408 2.28064 14.6774 2.13687 14.6642 1.98546Z"
                    fill="white"
                />
            </mask>
            <g mask="url(#mask1_feather_v5)">
                <g filter="url(#filter0_feather_v5)">
                    <path
                        d="M9.2762 4.03112C9.59786 3.9286 9.9516 4.08408 10.0893 4.40026C10.2362 4.73784 10.0812 5.13094 9.7436 5.27786L9.4858 5.3931C6.8392 6.60099 4.85102 8.39239 3.93372 10.2903C3.86962 10.4227 3.76681 10.5237 3.64596 10.5878L3.64271 10.5962C2.97658 12.2426 2.72646 13.6218 2.6694 14.0949L2.65768 14.1627C2.58352 14.4923 2.26987 14.7189 1.92721 14.6776C1.56188 14.6334 1.30115 14.3009 1.34518 13.9354L1.3849 13.6581C1.50507 12.9024 1.83249 11.4193 2.55677 9.73619L2.58737 9.67499C2.65906 9.54626 2.76864 9.44839 2.89596 9.39112C4.07756 7.19792 6.37433 5.2897 9.21173 4.0552L9.2762 4.03112Z"
                        fill="url(#paint1_feather_v5)"
                    />
                </g>
            </g>
            <path
                d="M14.6642 1.98546C14.6297 1.59261 14.2781 1.30002 13.8904 1.33629C6.92457 1.94572 3.77546 6.67805 2.38509 10.1492C2.25488 10.4743 2.41259 10.839 2.73281 10.9807L3.45408 11.2999C4.21889 11.6393 4.97035 11.7898 5.01473 11.7974C5.82799 11.9459 6.57975 12.0206 7.26923 12.0206C8.7043 12.0206 9.86877 11.6981 10.7449 11.0581C11.0978 10.7999 11.6694 10.2834 12.0684 9.40252C9.3723 9.90998 8.6699 7.98705 8.6699 7.98705C10.75 8.51345 13.1154 8.67532 13.749 6.24319C13.8814 5.66031 13.9657 5.09615 14.0466 4.55145L14.0494 4.53303C14.1769 3.68201 14.297 2.88039 14.5702 2.40305C14.6408 2.28064 14.6774 2.13687 14.6642 1.98546Z"
                fill="url(#paint2_feather_v5)"
            />
            <path
                d="M13.8898 1.33654C14.2775 1.30026 14.6294 1.59277 14.6638 1.98562C14.6771 2.13689 14.6406 2.28061 14.5701 2.40294C14.2969 2.88028 14.1768 3.68213 14.0493 4.53315L14.046 4.55138C13.9651 5.09608 13.8808 5.66055 13.7485 6.24344L13.684 6.46349C12.9674 8.66476 10.6848 8.49689 8.6697 7.98696C8.6697 7.98696 9.3721 9.90969 12.0682 9.40229C11.6692 10.283 11.0976 10.7998 10.7446 11.0579L10.5766 11.1744C9.72157 11.7371 8.6139 12.0207 7.2687 12.0208V11.5208C8.6317 11.5207 9.68304 11.2143 10.4497 10.6542C10.6314 10.5214 10.8828 10.3047 11.1326 9.98629C10.1958 9.97096 9.51544 9.65802 9.0421 9.27276C8.73484 9.02262 8.52817 8.75329 8.39757 8.54489C8.33217 8.44042 8.28484 8.35016 8.25304 8.28316C8.23717 8.24962 8.22537 8.22149 8.21657 8.20049C8.21224 8.18996 8.20824 8.18076 8.2055 8.17376C8.20424 8.17042 8.20324 8.16716 8.2023 8.16469C8.20184 8.16349 8.20137 8.16242 8.20097 8.16142L8.2003 8.16009V8.15942C8.20024 8.15916 8.2001 8.15849 8.6697 7.98696L8.1997 8.15882L7.87544 7.27016L8.7921 7.50256C9.81844 7.76229 10.8354 7.90822 11.6476 7.73562C12.0436 7.65149 12.3762 7.49442 12.6404 7.24929C12.9022 7.00636 13.1238 6.65087 13.2622 6.1243C13.3887 5.56538 13.471 5.02181 13.5519 4.47781L13.5545 4.45893C13.6176 4.03768 13.6818 3.6071 13.7661 3.2213C13.8492 2.84082 13.9608 2.46092 14.1359 2.1549L14.1365 2.15359C14.1596 2.11346 14.1694 2.07117 14.1658 2.02924C14.1554 1.91094 14.0466 1.8237 13.9366 1.83393L13.9334 1.83458C7.2319 2.42097 4.20298 6.95436 2.84876 10.3352C2.82326 10.3991 2.84957 10.4857 2.9347 10.5234L3.65605 10.8424L3.6567 10.843C4.01041 11 4.36521 11.1146 4.63912 11.1914C4.77536 11.2296 4.88977 11.2584 4.97181 11.2773L5.09941 11.3046L5.10397 11.3053C5.89332 11.4495 6.61478 11.5208 7.2687 11.5208V12.0208L7.00764 12.0169C6.39065 12.0006 5.7258 11.9275 5.01412 11.7975C4.97328 11.7904 4.39417 11.6743 3.73874 11.4186L3.45358 11.3001L2.73222 10.9804C2.4122 10.8386 2.2544 10.474 2.38457 10.149C3.75323 6.73216 6.82624 2.09324 13.5662 1.36778L13.8898 1.33654Z"
                fill="url(#paint3_feather_v5)"
            />
        </g>
        <defs>
            <filter id="filter0_feather_v5" x={-2.65967} y={-0.000244141} width={16.8042} height={18.6826} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation={2} result="effect1_foregroundBlur" />
            </filter>
            <linearGradient id="paint0_feather_v5" x1={5.7428} y1={3.99999} x2={5.7428} y2={14.6827} gradientUnits="userSpaceOnUse">
                <stop stopColor="#00A8B4" />
                <stop offset={1} stopColor="#04BCAD" />
            </linearGradient>
            <linearGradient id="paint1_feather_v5" x1={5.7428} y1={3.99999} x2={5.7428} y2={14.6827} gradientUnits="userSpaceOnUse">
                <stop stopColor="#575757" />
                <stop offset={1} stopColor="#151515" />
            </linearGradient>
            <linearGradient id="paint2_feather_v5" x1={8.4155} y1={1.33325} x2={8.4155} y2={12.0206} gradientUnits="userSpaceOnUse">
                <stop stopColor="#E9DBFF" stopOpacity={0.6} />
                <stop offset={1} stopColor="#C870FF" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="paint3_feather_v5" x1={8.5025} y1={1.33329} x2={8.5025} y2={7.52262} gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF7B8F" />
                <stop offset={1} stopColor="white" stopOpacity={0} />
            </linearGradient>
            <clipPath id="clip_feather_v5">
                <rect width={16} height={16} fill="white" />
            </clipPath>
        </defs>
    </svg>
)

// Brand Logos
const GeminiLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" fill="url(#gemini_grad)" />
        <defs>
            <linearGradient id="gemini_grad" x1="2" y1="2" x2="22" y2="22">
                <stop offset="0%" stopColor="#4E82EE" />
                <stop offset="100%" stopColor="#B659FF" />
            </linearGradient>
        </defs>
    </svg>
)

const ClaudeLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" stroke="#D97757" />
    </svg>
)

const ChatGPTLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M22.28 12.18c0-.71-.1-.85-.1-.85-.45-3.14-2.51-5.63-5.46-6.6-.46-.15-1.01-.27-1.46-.34-.91-.14-1.83-.14-2.74 0-.45.07-1 .19-1.46.34-2.95.97-5.01 3.46-5.46 6.6 0 0-.05.14-.1.85-.05.71 0 1.41.15 2.11.05.21.1.42.2.63l.1.32c.3.99.76 1.9 1.36 2.7.15.21.3.4.45.6.46.56 1.01 1.08 1.62 1.5.55.38 1.16.68 1.83.9.46.15.91.26 1.36.34.46.07.91.1 1.37.1.46 0 .91-.03 1.37-.1.46-.08.91-.19 1.36-.34.67-.22 1.28-.52 1.83-.9.61-.42 1.16-.94 1.62-1.5.15-.2.3-.39.45-.6.6-.8 1.06-1.71 1.36-2.7l.1-.32.2-.63c.15-.7.2-1.4.15-2.11z" fill="#74AA9C" />
    </svg>
)

// Glass Icons for Assistant/Pro

export default function AIWritingAssistanceV2() {
    const [content, setContent] = React.useState("")
    const [selectedAI, setSelectedAI] = React.useState("AI Assistant")
    const [selectedModel, setSelectedModel] = React.useState("Gemini Pro 3.1 (New)")

    const models = [
        { name: "Blog writing - Gemini Pro 3.1 (New)", value: "Gemini Pro 3.1 (New)", icon: <GeminiLogo className="size-4" /> },
        { name: "Code writing - Claude Opus (New)", value: "Claude Opus (New)", icon: <ClaudeLogo className="size-4" /> },
        { name: "Chat gpt - 4.1 2B LLM", value: "GPT-4", icon: <ChatGPTLogo className="size-4" /> },
    ]

    const aiOptions = [
        { name: "AI Assistant", icon: <CustomFeatherIcon className="size-4" /> },
        { name: "AI Pro", icon: <IconBadgeSparkle className="size-4" /> },
        { name: "AI Blog", icon: <IconBookOpen className="size-4" /> }
    ]

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#000000] p-4 sm:p-6 md:p-8 font-sans transition-colors duration-300 overflow-x-hidden" style={{ fontFamily: '"Inter", sans-serif' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes light-crossing {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
                .animate-shine-slow {
                    background: linear-gradient(
                        to right,
                        #8A8A8A 0%,
                        #8A8A8A 30%,
                        #FFFFFF 50%,
                        #8A8A8A 70%,
                        #8A8A8A 100%
                    );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    animation: light-crossing 5.3s linear infinite;
                }
            `}} />

            {/* Top Header Section */}
            <div className="flex flex-col items-center text-center gap-2 w-full mb-8 sm:mb-12 group/header max-w-[726px]">
                <div className="flex items-center gap-3 cursor-default">
                    <IconSparkle className="size-[24px] sm:size-[28px] text-black dark:text-white transition-all duration-300 opacity-80 group-hover/header:opacity-100 group-hover/header:scale-110" />
                    <h1 className="text-[24px] sm:text-[32px] font-medium tracking-tight text-black dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-[#E3E3E3] dark:to-[#A3A3A3] transition-all duration-300 group-hover/header:text-foreground  group-hover/header:brightness-110">
                        AI writing Assistant
                    </h1>
                </div>
                <p className="text-[#595959] dark:text-[#848484] text-[14px] sm:text-[16px] font-normal leading-relaxed max-w-[90%] sm:max-w-[500px] transition-colors duration-300 group-hover/header:text-black dark:group-hover/header:text-white/80">
                    Transform your ideas into polished content with AI-powered writing tools.
                </p>
            </div>

            {/* Main Container */}
            <div
                className="w-full max-w-[727px] min-h-[250px] h-auto bg-[#F5F5F5] dark:bg-gradient-to-b dark:from-[#0F0E0E] dark:to-[#000000] rounded-[24px] border border-[#E5E5E5] dark:border-[#343434] p-2 flex flex-col relative overflow-hidden transition-all duration-300 shadow-sm dark:shadow-2xl"
            >
                {/* Content Box */}
                <div
                    className="bg-white dark:bg-[#252323] rounded-[14px] sm:rounded-[16px] border border-[#E5E5E5] dark:border-[#343434] p-3 sm:p-4 flex flex-col relative overflow-hidden min-h-[160px] sm:h-[185px] transition-all duration-300 group/content"
                    style={{
                        boxShadow: 'inset 0 0 6px rgba(215, 214, 255, 0.2)'
                    }}
                >
                    <textarea
                        placeholder="Describe the content you want to generate..."
                        className="bg-transparent border-none focus:ring-0 text-black dark:text-white placeholder:text-[#999999] dark:placeholder:text-[#595959] placeholder:font-normal resize-none w-full flex-grow text-[15px] sm:text-[16px] leading-[1.6] outline-none transition-colors duration-200 min-h-[80px]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mt-2">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="text-[#008A8A] dark:text-[#84FDFF] transition-all hover:scale-110 active:scale-95 p-1">
                                        <Plus className="size-[18px] sm:size-[20px]" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white dark:bg-[#1A1A1A] border-[#E5E5E5] dark:border-[#343434] text-black dark:text-white">
                                    <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-gray-100 dark:focus:bg-[#2A2A2A]">
                                        <FileUp className="size-4 text-[#008A8A] dark:text-[#84FDFF]" />
                                        <span>Upload file</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-1 sm:gap-1.5 transition-all hover:bg-black/5 dark:hover:bg-white/5 rounded-md px-1 py-0.5 group/model-trigger">
                                        <div className="text-[#C97C15] dark:text-[#FFB260] transition-all group-hover/model-trigger:scale-110 active:scale-95 p-1">
                                            <Settings2 className="size-[18px] sm:size-[20px]" />
                                        </div>
                                        {/* Selected Model Display - Hidden on mobile text, keep logo */}
                                        <div className="flex items-center gap-2 transition-all duration-300">
                                            {selectedModel === "Gemini Pro 3.1 (New)" && (
                                                <>
                                                    <GeminiLogo className="size-4" />
                                                    <span className="hidden sm:inline text-[12px] sm:text-[13px] font-medium text-[#4E82EE]">Gemini Pro</span>
                                                </>
                                            )}
                                            {selectedModel === "Claude Opus (New)" && (
                                                <>
                                                    <ClaudeLogo className="size-4" />
                                                    <span className="hidden sm:inline text-[12px] sm:text-[13px] font-medium text-[#D97757]">Claude Opus</span>
                                                </>
                                            )}
                                            {selectedModel === "GPT-4" && (
                                                <>
                                                    <ChatGPTLogo className="size-4" />
                                                    <span className="hidden sm:inline text-[12px] sm:text-[13px] font-medium text-[#74AA9C]">ChatGPT 4.1</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white dark:bg-[#1A1A1A] border-[#E5E5E5] dark:border-[#343434] text-black dark:text-white w-72">
                                    {models.map((m) => (
                                        <DropdownMenuItem
                                            key={m.value}
                                            onClick={() => setSelectedModel(m.value)}
                                            className="gap-2.5 cursor-pointer focus:bg-gray-100 dark:focus:bg-[#2A2A2A]"
                                        >
                                            {m.icon}
                                            <span className="text-[13px]">{m.name}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-1.5 sm:gap-2 font-medium text-[13px] sm:text-[14px] transition-all duration-300 group/mode px-1.5 sm:px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 whitespace-nowrap">
                                        {selectedAI === "AI Assistant" && <CustomFeatherIcon className="size-[16px] sm:size-[18px]" />}
                                        {selectedAI === "AI Pro" && <IconBadgeSparkle className="size-[16px] sm:size-[18px]" style={{ color: "#FFB700" }} />}
                                        {selectedAI === "AI Blog" && <IconBookOpen className="size-[16px] sm:size-[18px]" style={{ color: "#00FF51" }} />}
                                        <span style={{ color: selectedAI === "AI Pro" ? "#FFB700" : selectedAI === "AI Blog" ? "#00FF51" : "#AFAFFF" }}>
                                            {selectedAI}
                                        </span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white dark:bg-[#1A1A1A] border-[#E5E5E5] dark:border-[#343434] text-black dark:text-white w-48">
                                    {aiOptions.map((opt) => (
                                        <DropdownMenuItem
                                            key={opt.name}
                                            onClick={() => setSelectedAI(opt.name)}
                                            className="gap-2.5 cursor-pointer focus:bg-gray-100 dark:focus:bg-[#2A2A2A]"
                                        >
                                            <div style={{ color: opt.name === "AI Pro" ? "#FFB700" : opt.name === "AI Blog" ? "#00FF51" : "#AFAFFF", opacity: 0.5 }}>
                                                {opt.icon}
                                            </div>
                                            <span className="text-[13px]">{opt.name}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                            <div className="hidden xs:flex items-center gap-1.5 text-[#888888] dark:text-[#595959] text-[11px] sm:text-[12px] font-medium transition-all group-hover/content:text-black dark:group-hover/content:text-white opacity-0 sm:opacity-100">
                                <Command className="size-[12px] sm:size-[14px]" />
                                <span>+ Enter</span>
                            </div>
                            <Button
                                size="icon"
                                className="h-[28px] w-[28px] sm:h-[30px] sm:w-[30px] rounded-[6px] sm:rounded-[8px] bg-[#C94215] text-white hover:brightness-110 active:scale-95 transition-all border-none"
                                style={{
                                    boxShadow: 'inset 0 -4px 4px rgba(255, 107, 39, 0.5)'
                                }}
                            >
                                <ArrowUp className="size-[16px] sm:size-[18px]" strokeWidth={2.5} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-2.5 sm:py-3 mt-auto cursor-default group/footer">
                    <span className="animate-shine-slow text-[10px] sm:text-[11px] tracking-wide font-normal text-black/60 dark:text-white/60 transition-colors group-hover/footer:text-black dark:group-hover/footer:text-white">
                        Upgrade to unlock for Teams
                    </span>
                    <button className="text-[#006ACC] dark:text-[#42A4FF] text-[10px] sm:text-[11px] font-medium hover:underline tracking-wide transition-colors hover:text-black dark:hover:text-white">
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </div>
    )
}
