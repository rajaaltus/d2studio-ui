"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowUp,
    ChevronDown,
    Plus,
    Settings2
} from "lucide-react"
import { IconSparkle } from "nucleo-glass"
import * as React from "react"

const AI_MODELS = [
    {
        id: "gemini",
        name: "Gemini",
        logo: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M12 3L14.5 9L21 12L14.5 15L12 21L9.5 15L3 12L9.5 9L12 3Z" fill="#4285F4" />
                <path d="M12 3L14.5 9L21 12L14.5 15L12 21L9.5 15L3 12L9.5 9L12 3Z" fill="url(#gemini_grad)" fillOpacity="0.8" />
                <defs>
                    <linearGradient id="gemini_grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4285F4" />
                        <stop offset="1" stopColor="#9B72CB" />
                    </linearGradient>
                </defs>
            </svg>
        )
    },
    {
        id: "chatgpt",
        name: "ChatGPT",
        logo: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#10A37F" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#10A37F" />
            </svg>
        )
    },
    {
        id: "claude",
        name: "Claude",
        logo: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <circle cx="12" cy="12" r="10" fill="#D97757" fillOpacity="0.2" />
                <path d="M12 8v8M8 12h8" stroke="#D97757" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        )
    },
    {
        id: "grok",
        name: "Grok",
        logo: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <rect x="3" y="3" width="18" height="18" rx="4" fill="black" />
                <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        )
    }
]

export default function AIContentCreatorCard() {
    const [selectedModel, setSelectedModel] = React.useState(AI_MODELS[0])
    return (
        <div className="flex items-center justify-center p-4">
            {/* Outer frame matching the designers #F9F9F9 rect with rx=32 */}
            <div className="w-full max-w-[571px] rounded-[32px] border border-[#E3E3E6] bg-[#F9F9F9] p-[8px] dark:bg-[#09090B] dark:border-[#18181B]">
                {/* Inner white card matching the white rect with rx=24 */}
                <div className="rounded-[24px] border border-[#D3D3D7] bg-white p-8 shadow-[0_2px_2px_0_rgba(0,0,0,0.12)] dark:bg-[#0A0A0A] dark:border-[#27272A] dark:shadow-none">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        {/* Pro Badge */}
                        <div className="flex items-center gap-1 rounded-md border border-[#E4E4E4] bg-[#F5F5F5] pl-1 pr-2 py-0.5 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <svg
                                width={20}
                                height={21}
                                viewBox="0 0 20 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="shrink-0 scale-90"
                            >
                                <g clipPath="url(#clip0_pro_icon)">
                                    <mask
                                        id="mask0_pro_icon"
                                        style={{ maskType: "luminance" }}
                                        maskUnits="userSpaceOnUse"
                                        x={0} y={0} width={20} height={21}
                                    >
                                        <path d="M20 0H0V21H20V0Z" fill="white" />
                                        <path
                                            d="M10 7.56011V1.64993C10 0.777385 8.84367 0.483345 8.43308 1.25149L3.34149 10.7766C2.92607 11.6142 3.53062 12.5999 4.45965 12.6001H10V7.56011Z"
                                            fill="black"
                                        />
                                    </mask>
                                    <g mask="url(#mask0_pro_icon)">
                                        <path
                                            d="M10 12.6V19.3502C10 20.2228 11.1563 20.5168 11.5669 19.7487L16.6585 10.2236C17.0739 9.38595 16.4694 8.40021 15.5403 8.40004H10V5.04004C7.91667 7.14004 6.56123 8.93503 6.25 12.6H10Z"
                                            fill="url(#paint0_linear_pro_icon)"
                                        />
                                    </g>
                                    <mask
                                        id="mask1_pro_icon"
                                        style={{ maskType: "luminance" }}
                                        maskUnits="userSpaceOnUse"
                                        x={3} y={0} width={7} height={13}
                                    >
                                        <path
                                            d="M10 7.56011V1.64993C10 0.777385 8.84367 0.483345 8.43308 1.25149L3.34149 10.7766C2.92607 11.6142 3.53062 12.5999 4.45965 12.6001H10V7.56011Z"
                                            fill="white"
                                        />
                                    </mask>
                                    <g mask="url(#mask1_pro_icon)">
                                        <g filter="url(#filter0_f_pro_icon)">
                                            <path
                                                d="M10 12.6V19.3502C10 20.2228 11.1563 20.5168 11.5669 19.7487L16.6585 10.2236C17.0739 9.38595 16.4694 8.40021 15.5403 8.40004H10V5.04004C7.91667 7.14004 6.56123 8.93503 6.25 12.6H10Z"
                                                fill="url(#paint1_linear_pro_icon)"
                                            />
                                        </g>
                                    </g>
                                    <path
                                        d="M10 7.56011V1.64993C10 0.777385 8.84367 0.483345 8.43308 1.25149L3.34149 10.7766C2.92607 11.6142 3.53062 12.5999 4.45965 12.6001H10V7.56011Z"
                                        fill="url(#paint2_linear_pro_icon)"
                                    />
                                    <path
                                        d="M8.43342 1.25055C8.84425 0.483413 9.99959 0.777297 10 1.64923V10.0796H9.375V1.64923C9.37492 1.57895 9.35392 1.54013 9.3335 1.51552C9.309 1.48612 9.26934 1.45892 9.21792 1.44579C9.16642 1.43272 9.11825 1.43734 9.08284 1.45153C9.05325 1.46344 9.01675 1.488 8.98359 1.54997L4.42302 10.0796H3.71338L8.43342 1.25055Z"
                                        fill="url(#paint3_linear_pro_icon)"
                                    />
                                </g>
                                <defs>
                                    <filter
                                        id="filter0_f_pro_icon"
                                        x={2.25} y={1.04004} width={18.542} height={23.1516}
                                        filterUnits="userSpaceOnUse"
                                        colorInterpolationFilters="sRGB"
                                    >
                                        <feFlood floodOpacity={0} result="BackgroundImageFix" />
                                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                        <feGaussianBlur stdDeviation={2} result="effect1_foregroundBlur_pro_icon" />
                                    </filter>
                                    <linearGradient
                                        id="paint0_linear_pro_icon"
                                        x1={11.5208} y1={5.04004} x2={11.5208} y2={22.68}
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="#575757" />
                                        <stop offset={1} stopColor="#151515" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint1_linear_pro_icon"
                                        x1={11.5208} y1={5.04004} x2={11.5208} y2={22.68}
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="#575757" />
                                        <stop offset={1} stopColor="#151515" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint2_linear_pro_icon"
                                        x1={6.60417} y1={-1.67989} x2={6.60417} y2={12.6001}
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="#6AFF34" stopOpacity={0.6} />
                                        <stop offset={1} stopColor="#91FF0A" stopOpacity={0.6} />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint3_linear_pro_icon"
                                        x1={6.85667} y1={0.808807} x2={6.85667} y2={9.23989}
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="white" />
                                        <stop offset={1} stopColor="white" stopOpacity={0} />
                                    </linearGradient>
                                    <clipPath id="clip0_pro_icon">
                                        <rect width={20} height={21} fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span className="text-[12px] font-bold text-black dark:text-white">Pro</span>
                        </div>

                        {/* Token count */}
                        <span className="text-[13px] font-medium text-[#371CFF] dark:text-[#8A7BFF]">12514 tokens left</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-[18px] font-semibold leading-tight tracking-tight text-[#18181B] dark:text-[#00FFA1]">
                            Structured Content Generator
                        </h2>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-[#71717A] dark:text-zinc-400">
                            Generate specific types of content with clear objectives and structured inputs
                        </p>
                    </div>

                    {/* Prompt Textarea Section */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-[#E3E3E6] bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                        <div className="p-4">
                            <textarea
                                placeholder="Describe the content you want to generate..."
                                className="min-h-[100px] w-full resize-none bg-transparent p-0 text-[14px] text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-100 placeholder:dark:text-zinc-600"
                            />
                        </div>
                        <div className="flex items-center justify-between border-t border-[#F4F4F5] bg-white px-4 py-3 dark:border-zinc-800/50 dark:bg-[#151518]">
                            <div className="flex items-center gap-3 text-zinc-400">
                                <Plus size={18} className="cursor-pointer hover:text-zinc-900 dark:hover:text-white" />
                                <Settings2 size={18} className="cursor-pointer hover:text-zinc-900 dark:hover:text-white" />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex cursor-pointer items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                            {selectedModel.logo}
                                            <ChevronDown size={12} strokeWidth={3} />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-[160px] dark:bg-zinc-900 dark:border-zinc-800">
                                        {AI_MODELS.map((model) => (
                                            <DropdownMenuItem
                                                key={model.id}
                                                className="flex items-center gap-2 cursor-pointer"
                                                onClick={() => setSelectedModel(model)}
                                            >
                                                {model.logo}
                                                <span className="text-sm font-medium">{model.name}</span>
                                                {selectedModel.id === model.id && (
                                                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#00FFA1]" />
                                                )}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden items-center gap-1.5 text-[11px] font-medium sm:flex">
                                    <span
                                        className="bg-clip-text text-transparent"
                                        style={{
                                            backgroundImage: 'linear-gradient(90deg, #71717A 0%, #CFCFE0 50%, #71717A 100%)',
                                            backgroundSize: '200% auto',
                                            animation: 'light-beam 3s linear infinite',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Upgrade to Team to unlock
                                    </span>
                                    <style dangerouslySetInnerHTML={{
                                        __html: `
                                        @keyframes light-beam {
                                            from { background-position: 200% 0; }
                                            to { background-position: -200% 0; }
                                        }
                                    ` }} />
                                    <span className="cursor-pointer text-[#371CFF] hover:underline dark:text-[#85B4FF]">Upgrade Plan</span>
                                </div>
                                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white transition-opacity hover:opacity-90 dark:bg-zinc-800 dark:text-[#00FFA1]">
                                    <ArrowUp size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mb-10 flex items-center gap-4">
                        <div className="h-px flex-1 bg-[#E3E3E6] dark:bg-zinc-800" />
                        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                            Or use structured inputs
                        </span>
                        <div className="h-px flex-1 bg-[#E3E3E6] dark:bg-zinc-800" />
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">Content Type</Label>
                            <Select defaultValue="social-media">
                                <SelectTrigger className="h-[40px] rounded-lg border-[#E3E3E6] bg-white text-[14px] shadow-sm focus:ring-1 focus:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200">
                                    <SelectValue placeholder="Select content type" />
                                </SelectTrigger>
                                <SelectContent side="bottom" align="start" className="rounded-lg dark:bg-zinc-900 dark:border-zinc-800">
                                    <SelectItem value="social-media">Social Media Post</SelectItem>
                                    <SelectItem value="blog-post">Blog Post</SelectItem>
                                    <SelectItem value="article">Article</SelectItem>
                                    <SelectItem value="email">Email Campaign</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">Topic / Product</Label>
                            <Input
                                defaultValue="Benefits of Remote Jobs"
                                className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-sm focus-visible:ring-1 focus-visible:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">Key Points (oner per line)</Label>
                            <Textarea
                                defaultValue={`Increased flexibility and work-life balance\nAccess to a global talent pool for companies\nReduced commuting time and costs`}
                                className="min-h-[120px] resize-none rounded-lg border-[#E3E3E6] py-3 text-[14px] leading-relaxed shadow-sm focus-visible:ring-1 focus-visible:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">Target Audience</Label>
                            <Input
                                defaultValue="Benefits of Remote Jobs"
                                className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-sm focus-visible:ring-1 focus-visible:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">Tone</Label>
                                <Select defaultValue="informative">
                                    <SelectTrigger className="h-[40px] rounded-lg border-[#E3E3E6] bg-white text-[14px] shadow-sm focus:ring-1 focus:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200">
                                        <SelectValue placeholder="Select tone" />
                                    </SelectTrigger>
                                    <SelectContent side="bottom" align="start" className="rounded-lg dark:bg-zinc-900 dark:border-zinc-800">
                                        <SelectItem value="informative">Informative</SelectItem>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
                                        <SelectItem value="humorous">Humorous</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">Length</Label>
                                <Input
                                    defaultValue="500 words"
                                    className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-sm focus-visible:ring-1 focus-visible:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">Keywords (Optional)</Label>
                            <Input
                                defaultValue="remote work, productivity"
                                className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-sm focus-visible:ring-1 focus-visible:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
                            />
                        </div>
                    </div>

                    <div className="mt-10 space-y-4">
                        {/* Light Mode Button */}
                        <button className="group relative flex h-[51px] w-full transform transition-all active:scale-[0.98] outline-none dark:hidden">
                            <svg
                                width="100%"
                                height="51"
                                viewBox="0 0 507 51"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-full w-full drop-shadow-sm transition-opacity group-hover:opacity-90"
                            >
                                <g filter="url(#cta-light-filter)">
                                    <rect width="507" height="51" rx="12" fill="#0A0A0A" />
                                    <rect x="0.5" y="0.5" width="506" height="50" rx="11.5" stroke="#C4C4C4" />
                                </g>
                                <foreignObject x="0" y="0" width="507" height="51">
                                    <div className="flex h-full w-full items-center justify-center gap-2.5">
                                        <IconSparkle className="size-5 text-white" />
                                        <span className="select-none text-[14px] font-normal text-white">Generate Content</span>
                                    </div>
                                </foreignObject>
                                <defs>
                                    <filter id="cta-light-filter" x="0" y="0" width="507" height="51" filterUnits="userSpaceOnUse">
                                        <feOffset dy="1" />
                                        <feGaussianBlur stdDeviation="1" />
                                        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                        <feBlend in2="SourceGraphic" />
                                    </filter>
                                </defs>
                            </svg>
                        </button>

                        {/* Dark Mode Button */}
                        <button className="relative hidden h-[52px] w-full transform items-center justify-center gap-3 rounded-[16px] border-2 border-[#9761F6] bg-gradient-to-b from-[#CDC2FF] to-[#100618] text-[#FFEBFE] transition-all hover:opacity-90 active:scale-[0.98] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] dark:flex">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="shrink-0"
                            >
                                <g clipPath="url(#sparkle_clip)">
                                    <mask id="sparkle_mask" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                        <path d="M24 0H0V24H24V0Z" fill="white" />
                                        <path d="M16.6562 9.21227L14.3939 3.51197C13.893 2.24988 12.1067 2.24972 11.6056 3.51173L9.34196 9.21227C9.31836 9.27154 9.27155 9.31835 9.21228 9.34195L3.51087 11.6059C2.24898 12.107 2.24898 13.893 3.51087 14.3941L9.21228 16.6581C9.27155 16.6817 9.31836 16.7285 9.34196 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34195C16.7273 9.31841 16.6799 9.27174 16.6562 9.21227Z" fill="black" />
                                    </mask>
                                    <g mask="url(#sparkle_mask)">
                                        <path d="M13.0001 9.00529C13.5523 9.00529 14 9.45306 14.0001 10.0053V12.0053H16.0001C16.5523 12.0053 17 12.4531 17.0001 13.0053C16.9999 13.5574 16.5522 14.0053 16.0001 14.0053H14.0001V16.0053C13.9999 16.5574 13.5522 17.0053 13.0001 17.0053C12.448 17.0053 12.0003 16.5574 12.0001 16.0053V14.0053H10.0001C9.448 14.0053 9.00034 13.5574 9.00009 13.0053C9.00016 12.4531 9.44789 12.0054 10.0001 12.0053H12.0001V10.0053C12.0002 9.45309 12.4479 9.00534 13.0001 9.00529ZM6.0704 1.34123C6.40449 0.499893 7.59584 0.499834 7.92978 1.34123L9.25009 4.66935C9.26462 4.70569 9.29382 4.73394 9.33017 4.74845L12.6593 6.07072C13.5006 6.40475 13.5006 7.59507 12.6593 7.92912L9.33017 9.25138C9.29383 9.26588 9.26463 9.29417 9.25009 9.33049L7.92978 12.6586C7.59584 13.5 6.40449 13.5 6.0704 12.6586L4.74911 9.33049C4.73455 9.29416 4.7054 9.26586 4.66904 9.25138L1.34091 7.92912C0.499646 7.59507 0.499646 6.40477 1.34091 6.07072L4.66904 4.74845C4.70542 4.73397 4.73456 4.7057 4.74911 4.66935L6.0704 1.34123Z" fill="url(#paint0_sparkle)" />
                                    </g>
                                    <path d="M16.6562 9.21227L14.3939 3.51197C13.893 2.24988 12.1067 2.24972 11.6056 3.51173L9.34196 9.21227C9.31836 9.27154 9.27155 9.31835 9.21228 9.34195L3.51087 11.6059C2.24898 12.107 2.24898 13.893 3.51087 14.3941L9.21228 16.6581C9.27155 16.6817 9.31836 16.7285 9.34196 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34195C16.7273 9.31841 16.6799 9.27174 16.6562 9.21227Z" fill="url(#paint1_sparkle)" />
                                    <path d="M11.6054 3.51174C12.1064 2.24985 13.8924 2.24997 14.3934 3.51174L16.6561 9.21194C16.6798 9.27141 16.7275 9.31828 16.787 9.34182L22.4882 11.6055C23.7501 12.1065 23.7501 13.8935 22.4882 14.3946L16.787 16.6582L16.745 16.6797C16.7052 16.7056 16.6739 16.7433 16.6561 16.7881L14.3934 22.4883L14.3427 22.6026C13.8 23.7118 12.1987 23.712 11.6561 22.6026L11.6054 22.4883L9.34168 16.7881C9.31809 16.7288 9.27106 16.6818 9.2118 16.6582L3.51063 14.3946C2.24874 13.8935 2.24874 12.1066 3.51063 11.6055L9.2118 9.34182C9.27106 9.31822 9.31809 9.2712 9.34168 9.21194L11.6054 3.51174ZM13.6972 3.78909C13.4468 3.15817 12.5534 3.15751 12.3026 3.78811L10.0389 9.48928C9.95156 9.70875 9.78837 9.88881 9.58094 9.99709L9.48914 10.0391L3.78797 12.3028C3.15702 12.5533 3.15703 13.4467 3.78797 13.6973L9.48914 15.961C9.70861 16.0483 9.88867 16.2115 9.99695 16.419L10.0389 16.5108L12.3026 22.2119C12.5534 22.8425 13.4458 22.8419 13.6962 22.211L15.9589 16.5108L16.0018 16.418C16.1117 16.2083 16.293 16.047 16.5097 15.961L22.2118 13.6973C22.8428 13.4468 22.8428 12.5533 22.2118 12.3028L16.5097 10.0391C16.2931 9.95306 16.1116 9.79167 16.0018 9.58205L15.9589 9.48928L13.6972 3.78909Z" fill="url(#paint2_sparkle)" />
                                </g>
                                <defs>
                                    <linearGradient id="paint0_sparkle" x1="8.85509" y1="0.709981" x2="8.85509" y2="13.5" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#575757" />
                                        <stop offset="1" stopColor="#151515" />
                                    </linearGradient>
                                    <linearGradient id="paint1_sparkle" x1="13" y1="0.00000500753" x2="13" y2="26" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#E3E3E5" stopOpacity={0.6} />
                                        <stop offset="1" stopColor="#BBBBC0" stopOpacity={0.6} />
                                    </linearGradient>
                                    <linearGradient id="paint2_sparkle" x1="12.999" y1="2.565" x2="12.999" y2="13.5" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="white" />
                                        <stop offset="1" stopColor="white" stopOpacity={0} />
                                    </linearGradient>
                                    <clipPath id="sparkle_clip">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span className="text-[14px] font-medium">Generate Content</span>
                        </button>
                        <Button
                            variant="ghost"
                            className="h-auto w-full text-[14px] font-medium text-[#18181B] hover:bg-transparent hover:text-[#18181B]/70 dark:text-zinc-500 dark:hover:text-zinc-400"
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
