"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IconSparkle } from "nucleo-glass";
import * as React from "react";

const AI_MODELS = [
  {
    id: "gemini",
    name: "Gemini",
    logo: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M12 3L14.5 9L21 12L14.5 15L12 21L9.5 15L3 12L9.5 9L12 3Z"
          fill="#4285F4"
        />
        <path
          d="M12 3L14.5 9L21 12L14.5 15L12 21L9.5 15L3 12L9.5 9L12 3Z"
          fill="url(#gemini_grad)"
          fillOpacity="0.8"
        />
        <defs>
          <linearGradient
            id="gemini_grad"
            x1="3"
            y1="3"
            x2="21"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4285F4" />
            <stop offset="1" stopColor="#9B72CB" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    logo: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          fill="#10A37F"
        />
        <path
          d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
          fill="#10A37F"
        />
      </svg>
    ),
  },
  {
    id: "claude",
    name: "Claude",
    logo: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="10" fill="#D97757" fillOpacity="0.2" />
        <path
          d="M12 8v8M8 12h8"
          stroke="#D97757"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "grok",
    name: "Grok",
    logo: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" fill="black" />
        <path
          d="M8 8l8 8M16 8l-8 8"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function AIContentCreatorCard() {
  const [selectedModel, setSelectedModel] = React.useState(AI_MODELS[0]);
  return (
    <div className="flex items-center justify-center p-4">
      {/* Outer frame matching the designers #F9F9F9 rect with rx=32 */}
      <div className="w-full max-w-[571px] rounded-[32px] border border-[#E3E3E6] bg-[#F9F9F9] p-[8px] dark:bg-[#09090B] dark:border-[#18181B]">
        {/* Inner white card matching the white rect with rx=24 */}
        <div className="rounded-[24px] border border-[#D3D3D7] bg-white p-4 sm:p-8 shadow-[0_2px_2px_0_rgba(0,0,0,0.12)] dark:bg-[#0A0A0A] dark:border-[#27272A] dark:shadow-none">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            {/* Pro Badge */}
            <div className="flex items-center gap-1 rounded-md border border-[#E4E4E4] bg-gradient-to-b from-[#FEFEFE] to-[#E5E5E5] pl-1 pr-2 py-0.5 shadow-[0_2px_2px_0_rgba(0,0,0,0.15)] dark:border-[#505050] dark:bg-gradient-to-b dark:from-[#3D3D3D] dark:to-[#0D0D0D]">
              <div className="flex items-center justify-center">
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
                      x={0}
                      y={0}
                      width={20}
                      height={21}
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
                      x={3}
                      y={0}
                      width={7}
                      height={13}
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
                      x={2.25}
                      y={1.04004}
                      width={18.542}
                      height={23.1516}
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity={0} result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feGaussianBlur
                        stdDeviation={2}
                        result="effect1_foregroundBlur_pro_icon"
                      />
                    </filter>
                    <linearGradient
                      id="paint0_linear_pro_icon"
                      x1={11.5208}
                      y1={5.04004}
                      x2={11.5208}
                      y2={22.68}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#575757" />
                      <stop offset={1} stopColor="#151515" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_pro_icon"
                      x1={11.5208}
                      y1={5.04004}
                      x2={11.5208}
                      y2={22.68}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#575757" />
                      <stop offset={1} stopColor="#151515" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_pro_icon"
                      x1={6.60417}
                      y1={-1.67989}
                      x2={6.60417}
                      y2={12.6001}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#6AFF34" stopOpacity={0.6} />
                      <stop offset={1} stopColor="#91FF0A" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_pro_icon"
                      x1={6.85667}
                      y1={0.808807}
                      x2={6.85667}
                      y2={9.23989}
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
              </div>
              <span className="text-[14px] font-medium text-black dark:text-white select-none">
                Pro
              </span>
            </div>

            {/* Token count */}
            <span className="text-[13px] font-medium text-[#371CFF] dark:text-[#A89CFF]">
              12514 tokens left
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-[18px] font-semibold leading-tight tracking-tight text-[#18181B] dark:text-[#00FFA1]">
              Structured Content Generator
            </h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#71717A] dark:text-zinc-400">
              Generate specific types of content with clear objectives and
              structured inputs
            </p>
          </div>

          {/* Prompt Textarea Section */}
          <div className="mb-8 overflow-hidden rounded-[24px] border border-[#D3D3D7] bg-[#F3F3F4] p-[4px] dark:bg-zinc-900/50 dark:border-zinc-800">
            {/* Top white container */}
            <div className="flex flex-col rounded-[16px] border border-[#E3E3E6] bg-white shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] dark:bg-[#0A0A0A] dark:border-zinc-800 dark:shadow-[inset_0_-2px_4px_0_rgba(110,110,110,0.12)]">
              <div className="p-4">
                <textarea
                  placeholder="Describe the content you want to generate..."
                  className="min-h-[80px] w-full resize-none bg-transparent p-0 text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 placeholder:dark:text-zinc-600"
                />
              </div>

              {/* Inner Actions Bar */}
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-3">
                  {/* Action Icons */}
                  <div className="flex items-center gap-3">
                    {/* Custom Styled Plus Icon (Add Glass) */}
                    <button className="flex h-4 w-4 items-center justify-center transition-transform active:scale-95 [--plus-glass-1:#E3E3E5] [--plus-glass-2:#BBBBC0] [--plus-outline-1:white] [--plus-outline-2:white] dark:[--plus-glass-1:white] dark:[--plus-glass-2:#FF54F6] dark:[--plus-outline-1:#F9A9FF] dark:[--plus-outline-2:#AE2BFF]">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_plus_glass_v2)">
                          <mask
                            id="mask0_plus_glass_v2"
                            style={{ maskType: "luminance" }}
                            maskUnits="userSpaceOnUse"
                            x={0}
                            y={0}
                            width={16}
                            height={16}
                          >
                            <path d="M16 0H0V16H16V0Z" fill="white" />
                            <foreignObject x={0} y={0} width={0} height={0}>
                              <div
                                style={{
                                  backdropFilter: "blur(1.5px)",
                                  clipPath:
                                    "url(#bgblur_1_plus_glass_v2_clip_path)",
                                  height: "100%",
                                  width: "100%",
                                }}
                              />
                            </foreignObject>
                            <path
                              data-figma-bg-blur-radius={3}
                              d="M10.7332 4.33325C12.2267 4.33325 12.974 4.33297 13.5444 4.62362C14.0461 4.87926 14.4542 5.28731 14.7098 5.78898C15.0004 6.35941 15.0002 7.10672 15.0002 8.60019V10.733C15.0002 12.2265 15.0004 12.9738 14.7098 13.5442C14.4542 14.0459 14.0461 14.4539 13.5444 14.7096C12.974 15.0002 12.2267 14.9999 10.7332 14.9999H8.60043C7.10696 14.9999 6.35966 15.0002 5.78922 14.7096C5.28756 14.4539 4.8795 14.0459 4.62386 13.5442C4.33321 12.9738 4.3335 12.2265 4.3335 10.733V8.60019C4.3335 7.10672 4.33321 6.35941 4.62386 5.78898C4.87951 5.28731 5.28756 4.87926 5.78922 4.62362C6.35966 4.33297 7.10696 4.33325 8.60043 4.33325H10.7332ZM9.66943 6.66659C9.30123 6.66659 9.00276 6.96505 9.00276 7.33325V8.99992H7.3335C6.96536 8.99999 6.66683 9.29845 6.66683 9.66659C6.66683 10.0347 6.96536 10.3332 7.3335 10.3333H9.00276V11.9999C9.00276 12.3681 9.30123 12.6666 9.66943 12.6666C10.0376 12.6666 10.3361 12.3681 10.3361 11.9999V10.3333H12.0002C12.3684 10.3333 12.6668 10.0348 12.6668 9.66659C12.6668 9.29839 12.3684 8.99992 12.0002 8.99992H10.3361V7.33325C10.3361 6.96505 10.0376 6.66659 9.66943 6.66659Z"
                              fill="black"
                            />
                          </mask>
                          <g mask="url(#mask0_plus_glass_v2)">
                            <path
                              d="M6.18177 1.10454C7.62407 0.718073 8.34534 0.524295 8.97147 0.657274C9.52234 0.77436 10.0224 1.06299 10.3992 1.48149C10.8276 1.95726 11.0205 2.67891 11.407 4.12147L11.9591 6.18201C12.2374 7.22059 12.4146 7.88532 12.4429 8.40985C12.9612 8.59259 13.3333 9.08552 13.3335 9.66639C13.3335 10.4027 12.7364 10.9996 12.0001 10.9997H11.0021V11.9997C11.0021 12.7361 10.4051 13.3331 9.66874 13.3331C8.93247 13.3329 8.3354 12.736 8.3354 11.9997V11.5694L6.88167 11.9594C5.43932 12.3459 4.71806 12.5396 4.09192 12.4067C3.54109 12.2895 3.04101 12.0009 2.66419 11.5824C2.23582 11.1067 2.04291 10.385 1.65638 8.94245L1.1043 6.88185C0.717824 5.43956 0.52405 4.71831 0.657031 4.09217C0.774118 3.54133 1.06275 3.04125 1.48125 2.66443C1.95702 2.23608 2.67868 2.04315 4.12122 1.65662L6.18177 1.10454Z"
                              fill="url(#paint0_plus_glass_v2)"
                            />
                          </g>
                          <mask
                            id="mask1_plus_glass_v2"
                            style={{ maskType: "luminance" }}
                            maskUnits="userSpaceOnUse"
                            x={4}
                            y={4}
                            width={11}
                            height={11}
                          >
                            <foreignObject x={0} y={0} width={0} height={0}>
                              <div
                                style={{
                                  backdropFilter: "blur(1.5px)",
                                  clipPath:
                                    "url(#bgblur_2_plus_glass_v2_clip_path)",
                                  height: "100%",
                                  width: "100%",
                                }}
                              />
                            </foreignObject>
                            <path
                              data-figma-bg-blur-radius={3}
                              d="M10.7332 4.33325C12.2267 4.33325 12.974 4.33297 13.5444 4.62362C14.0461 4.87926 14.4542 5.28731 14.7098 5.78898C15.0004 6.35941 15.0002 7.10672 15.0002 8.60019V10.733C15.0002 12.2265 15.0004 12.9738 14.7098 13.5442C14.4542 14.0459 14.0461 14.4539 13.5444 14.7096C12.974 15.0002 12.2267 14.9999 10.7332 14.9999H8.60043C7.10696 14.9999 6.35966 15.0002 5.78922 14.7096C5.28756 14.4539 4.8795 14.0459 4.62386 13.5442C4.33321 12.9738 4.3335 12.2265 4.3335 10.733V8.60019C4.3335 7.10672 4.33321 6.35941 4.62386 5.78898C4.87951 5.28731 5.28756 4.87926 5.78922 4.62362C6.35966 4.33297 7.10696 4.33325 8.60043 4.33325H10.7332ZM9.66943 6.66659C9.30123 6.66659 9.00276 6.96505 9.00276 7.33325V8.99992H7.3335C6.96536 8.99999 6.66683 9.29845 6.66683 9.66659C6.66683 10.0347 6.96536 10.3332 7.3335 10.3333H9.00276V11.9999C9.00276 12.3681 9.30123 12.6666 9.66943 12.6666C10.0376 12.6666 10.3361 12.3681 10.3361 11.9999V10.3333H12.0002C12.3684 10.3333 12.6668 10.0348 12.6668 9.66659C12.6668 9.29839 12.3684 8.99992 12.0002 8.99992H10.3361V7.33325C10.3361 6.96505 10.0376 6.66659 9.66943 6.66659Z"
                              fill="white"
                            />
                          </mask>
                          <g mask="url(#mask1_plus_glass_v2)">
                            <g filter="url(#filter0_plus_glass_v2)">
                              <path
                                d="M6.18226 1.10454C7.62456 0.718073 8.34583 0.524295 8.97196 0.657274C9.52283 0.77436 10.0229 1.06299 10.3997 1.48149C10.8281 1.95726 11.021 2.67891 11.4075 4.12147L11.9596 6.18201C12.2379 7.22059 12.4151 7.88532 12.4434 8.40985C12.9617 8.59259 13.3338 9.08552 13.334 9.66639C13.334 10.4027 12.7369 10.9996 12.0006 10.9997H11.0026V11.9997C11.0026 12.7361 10.4056 13.3331 9.66923 13.3331C8.93296 13.3329 8.33589 12.736 8.33589 11.9997V11.5694L6.88216 11.9594C5.43981 12.3459 4.71855 12.5396 4.09241 12.4067C3.54158 12.2895 3.0415 12.0009 2.66468 11.5824C2.23631 11.1067 2.0434 10.385 1.65687 8.94245L1.10479 6.88185C0.718313 5.43956 0.524538 4.71831 0.657519 4.09217C0.774606 3.54133 1.06324 3.04125 1.48174 2.66443C1.95751 2.23608 2.67917 2.04315 4.12171 1.65662L6.18226 1.10454Z"
                                fill="url(#paint1_plus_glass_v2)"
                              />
                            </g>
                          </g>
                          <foreignObject
                            x={1.3335}
                            y={1.33325}
                            width={16.6665}
                            height={16.6667}
                          >
                            <div
                              style={{
                                backdropFilter: "blur(1.5px)",
                                clipPath:
                                  "url(#bgblur_3_plus_glass_v2_clip_path)",
                                height: "100%",
                                width: "100%",
                              }}
                            />
                          </foreignObject>
                          <path
                            data-figma-bg-blur-radius={3}
                            d="M10.7332 4.33325C12.2267 4.33325 12.974 4.33297 13.5444 4.62362C14.0461 4.87926 14.4542 5.28731 14.7098 5.78898C15.0004 6.35941 15.0002 7.10672 15.0002 8.60019V10.733C15.0002 12.2265 15.0004 12.9738 14.7098 13.5442C14.4542 14.0459 14.0461 14.4539 13.5444 14.7096C12.974 15.0002 12.2267 14.9999 10.7332 14.9999H8.60043C7.10696 14.9999 6.35966 15.0002 5.78922 14.7096C5.28756 14.4539 4.8795 14.0459 4.62386 13.5442C4.33321 12.9738 4.3335 12.2265 4.3335 10.733V8.60019C4.3335 7.10672 4.33321 6.35941 4.62386 5.78898C4.87951 5.28731 5.28756 4.87926 5.78922 4.62362C6.35966 4.33297 7.10696 4.33325 8.60043 4.33325H10.7332ZM9.66943 6.66659C9.30123 6.66659 9.00276 6.96505 9.00276 7.33325V8.99992H7.3335C6.96536 8.99999 6.66683 9.29845 6.66683 9.66659C6.66683 10.0347 6.96536 10.3332 7.3335 10.3333H9.00276V11.9999C9.00276 12.3681 9.30123 12.6666 9.66943 12.6666C10.0376 12.6666 10.3361 12.3681 10.3361 11.9999V10.3333H12.0002C12.3684 10.3333 12.6668 10.0348 12.6668 9.66659C12.6668 9.29839 12.3684 8.99992 12.0002 8.99992H10.3361V7.33325C10.3361 6.96505 10.0376 6.66659 9.66943 6.66659Z"
                            fill="url(#paint2_plus_glass_v2)"
                          />
                          <path
                            d="M10.7332 14.4999V14.9999H8.60043V14.4999H10.7332ZM14.5002 10.733V8.60019C14.5002 7.84525 14.5 7.30879 14.4656 6.88925C14.4318 6.47549 14.3672 6.21918 14.2638 6.01619C14.0561 5.60861 13.7248 5.27729 13.3172 5.06958C13.1142 4.96616 12.8579 4.90157 12.4442 4.86776C12.0246 4.83349 11.4882 4.83325 10.7332 4.83325H8.60043C7.8455 4.83325 7.30903 4.83349 6.8895 4.86776C6.47574 4.90157 6.21942 4.96616 6.01644 5.06958C5.60886 5.27729 5.27753 5.60861 5.06982 6.01619C4.9664 6.21918 4.90181 6.47549 4.868 6.88925C4.83373 7.30879 4.8335 7.84525 4.8335 8.60019V10.733C4.8335 11.4879 4.83373 12.0244 4.868 12.4439C4.90181 12.8577 4.9664 13.114 5.06982 13.317C5.27753 13.7246 5.60886 14.0559 6.01644 14.2636C6.21942 14.367 6.47574 14.4316 6.8895 14.4654C7.30903 14.4997 7.8455 14.4999 8.60043 14.4999V14.9999L7.61083 14.9954C6.81636 14.9829 6.30742 14.936 5.8986 14.7603L5.78922 14.7096C5.35024 14.4859 4.98292 14.1455 4.72672 13.7278L4.62386 13.5442C4.33321 12.9738 4.3335 12.2265 4.3335 10.733V8.60019C4.3335 7.10672 4.33321 6.35941 4.62386 5.78898C4.87951 5.28731 5.28756 4.87927 5.78922 4.62362C6.217 4.40566 6.74423 4.35144 7.61083 4.33781L8.60043 4.33325H10.7332C12.2267 4.33325 12.974 4.33297 13.5444 4.62362C14.0461 4.87927 14.4542 5.28731 14.7098 5.78898C15.0004 6.35941 15.0002 7.10672 15.0002 8.60019V10.733C15.0002 12.2265 15.0004 12.9738 14.7098 13.5442L14.607 13.7278C14.3508 14.1455 13.9834 14.4859 13.5444 14.7096L13.435 14.7603C12.8775 14.9999 12.1334 14.9999 10.7332 14.9999V14.4999C11.4882 14.4999 12.0246 14.4997 12.4442 14.4654C12.8579 14.4316 13.1142 14.367 13.3172 14.2636C13.7248 14.0559 14.0561 13.7246 14.2638 13.317C14.3672 13.114 14.4318 12.8577 14.4656 12.4439C14.5 12.0244 14.5002 11.4879 14.5002 10.733Z"
                            fill="url(#paint3_plus_glass_v2)"
                          />
                        </g>
                        <defs>
                          <clipPath
                            id="bgblur_1_plus_glass_v2_clip_path"
                            transform="translate(0 0)"
                          >
                            <path d="M10.7332 4.33325C12.2267 4.33325 12.974 4.33297 13.5444 4.62362C14.0461 4.87926 14.4542 5.28731 14.7098 5.78898C15.0004 6.35941 15.0002 7.10672 15.0002 8.60019V10.733C15.0002 12.2265 15.0004 12.9738 14.7098 13.5442C14.4542 14.0459 14.0461 14.4539 13.5444 14.7096C12.974 15.0002 12.2267 14.9999 10.7332 14.9999H8.60043C7.10696 14.9999 6.35966 15.0002 5.78922 14.7096C5.28756 14.4539 4.8795 14.0459 4.62386 13.5442C4.33321 12.9738 4.3335 12.2265 4.3335 10.733V8.60019C4.3335 7.10672 4.33321 6.35941 4.62386 5.78898C4.87951 5.28731 5.28756 4.87926 5.78922 4.62362C6.35966 4.33297 7.10696 4.33325 8.60043 4.33325H10.7332ZM9.66943 6.66659C9.30123 6.66659 9.00276 6.96505 9.00276 7.33325V8.99992H7.3335C6.96536 8.99999 6.66683 9.29845 6.66683 9.66659C6.66683 10.0347 6.96536 10.3332 7.3335 10.3333H9.00276V11.9999C9.00276 12.3681 9.30123 12.6666 9.66943 12.6666C10.0376 12.6666 10.3361 12.3681 10.3361 11.9999V10.3333H12.0002C12.3684 10.3333 12.6668 10.0348 12.6668 9.66659C12.6668 9.29839 12.3684 8.99992 12.0002 8.99992H10.3361V7.33325C10.3361 6.96505 10.0376 6.66659 9.66943 6.66659Z" />
                          </clipPath>
                          <clipPath
                            id="bgblur_2_plus_glass_v2_clip_path"
                            transform="translate(0 0)"
                          >
                            <path d="M10.7332 4.33325C12.2267 4.33325 12.974 4.33297 13.5444 4.62362C14.0461 4.87926 14.4542 5.28731 14.7098 5.78898C15.0004 6.35941 15.0002 7.10672 15.0002 8.60019V10.733C15.0002 12.2265 15.0004 12.9738 14.7098 13.5442C14.4542 14.0459 14.0461 14.4539 13.5444 14.7096C12.974 15.0002 12.2267 14.9999 10.7332 14.9999H8.60043C7.10696 14.9999 6.35966 15.0002 5.78922 14.7096C5.28756 14.4539 4.8795 14.0459 4.62386 13.5442C4.33321 12.9738 4.3335 12.2265 4.3335 10.733V8.60019C4.3335 7.10672 4.33321 6.35941 4.62386 5.78898C4.87951 5.28731 5.28756 4.87926 5.78922 4.62362C6.35966 4.33297 7.10696 4.33325 8.60043 4.33325H10.7332ZM9.66943 6.66659C9.30123 6.66659 9.00276 6.96505 9.00276 7.33325V8.99992H7.3335C6.96536 8.99999 6.66683 9.29845 6.66683 9.66659C6.66683 10.0347 6.96536 10.3332 7.3335 10.3333H9.00276V11.9999C9.00276 12.3681 9.30123 12.6666 9.66943 12.6666C10.0376 12.6666 10.3361 12.3681 10.3361 11.9999V10.3333H12.0002C12.3684 10.3333 12.6668 10.0348 12.6668 9.66659C12.6668 9.29839 12.3684 8.99992 12.0002 8.99992H10.3361V7.33325C10.3361 6.96505 10.0376 6.66659 9.66943 6.66659Z" />
                          </clipPath>
                          <filter
                            id="filter0_plus_glass_v2"
                            x={-3.38428}
                            y={-3.38452}
                            width={20.7183}
                            height={20.7175}
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood
                              floodOpacity={0}
                              result="BackgroundImageFix"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="BackgroundImageFix"
                              result="shape"
                            />
                            <feGaussianBlur
                              stdDeviation={2}
                              result="effect1_foregroundBlur_plus_glass_v2"
                            />
                          </filter>
                          <clipPath
                            id="bgblur_3_plus_glass_v2_clip_path"
                            transform="translate(-1.3335 -1.33325)"
                          >
                            <path d="M10.7332 4.33325C12.2267 4.33325 12.974 4.33297 13.5444 4.62362C14.0461 4.87926 14.4542 5.28731 14.7098 5.78898C15.0004 6.35941 15.0002 7.10672 15.0002 8.60019V10.733C15.0002 12.2265 15.0004 12.9738 14.7098 13.5442C14.4542 14.0459 14.0461 14.4539 13.5444 14.7096C12.974 15.0002 12.2267 14.9999 10.7332 14.9999H8.60043C7.10696 14.9999 6.35966 15.0002 5.78922 14.7096C5.28756 14.4539 4.8795 14.0459 4.62386 13.5442C4.33321 12.9738 4.3335 12.2265 4.3335 10.733V8.60019C4.3335 7.10672 4.33321 6.35941 4.62386 5.78898C4.87951 5.28731 5.28756 4.87926 5.78922 4.62362C6.35966 4.33297 7.10696 4.33325 8.60043 4.33325H10.7332ZM9.66943 6.66659C9.30123 6.66659 9.00276 6.96505 9.00276 7.33325V8.99992H7.3335C6.96536 8.99999 6.66683 9.29845 6.66683 9.66659C6.66683 10.0347 6.96536 10.3332 7.3335 10.3333H9.00276V11.9999C9.00276 12.3681 9.30123 12.6666 9.66943 12.6666C10.0376 12.6666 10.3361 12.3681 10.3361 11.9999V10.3333H12.0002C12.3684 10.3333 12.6668 10.0348 12.6668 9.66659C12.6668 9.29839 12.3684 8.99992 12.0002 8.99992H10.3361V7.33325C10.3361 6.96505 10.0376 6.66659 9.66943 6.66659Z" />
                          </clipPath>
                          <linearGradient
                            id="paint0_plus_glass_v2"
                            x1={6.8078}
                            y1={0.61532}
                            x2={6.8078}
                            y2={13}
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#575757" />
                            <stop offset={1} stopColor="#151515" />
                          </linearGradient>
                          <linearGradient
                            id="paint1_plus_glass_v2"
                            x1={6.80829}
                            y1={0.61532}
                            x2={6.80829}
                            y2={13}
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#575757" />
                            <stop offset={1} stopColor="#151515" />
                          </linearGradient>
                          <linearGradient
                            id="paint2_plus_glass_v2"
                            x1={9.66683}
                            y1={4.33325}
                            x2={9.66683}
                            y2={14.9999}
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop
                              stopColor="var(--plus-glass-1)"
                              stopOpacity={0.6}
                            />
                            <stop
                              offset={1}
                              stopColor="var(--plus-glass-2)"
                              stopOpacity={0.6}
                            />
                          </linearGradient>
                          <linearGradient
                            id="paint3_plus_glass_v2"
                            x1={9.66683}
                            y1={4.33325}
                            x2={9.66683}
                            y2={10.9999}
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="var(--plus-outline-1)" />
                            <stop
                              offset={1}
                              stopColor="var(--plus-outline-2)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <clipPath id="clip0_plus_glass_v2">
                            <rect width={16} height={16} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>

                    {/* Custom Styled Settings Icon */}
                    <button className="flex h-4 w-4 items-center justify-center transition-transform active:scale-95 [--settings-glass-1:#E3E3E5] [--settings-glass-2:#BBBBC0] [--settings-top-1:white] [--settings-top-2:white] [--settings-bot-1:white] [--settings-bot-2:white] dark:[--settings-glass-1:#E3E3E5] dark:[--settings-glass-2:#0C5969] dark:[--settings-top-1:#7EF032] dark:[--settings-top-2:#09CC09] dark:[--settings-bot-1:#00CCFF] dark:[--settings-bot-2:#00A1E1]">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_settings_glass)">
                          <mask
                            id="mask0_settings_glass"
                            style={{ maskType: "luminance" }}
                            maskUnits="userSpaceOnUse"
                            x={0}
                            y={0}
                            width={24}
                            height={24}
                          >
                            <path d="M24 0H0V24H24V0Z" fill="white" />
                            <path
                              d="M6.5 12.5C8.98528 12.5 11 14.5147 11 17C11 19.4853 8.98528 21.5 6.5 21.5C4.01472 21.5 2 19.4853 2 17C2 14.5147 4.01472 12.5 6.5 12.5ZM17.5 2.5C19.9853 2.5 22 4.51472 22 7C22 9.48528 19.9853 11.5 17.5 11.5C15.0147 11.5 13 9.48528 13 7C13 4.51472 15.0147 2.5 17.5 2.5Z"
                              fill="black"
                            />
                          </mask>
                          <g mask="url(#mask0_settings_glass)">
                            <path
                              d="M21 16C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H6C5.44772 18 5 17.5523 5 17C5 16.4477 5.44772 16 6 16H21ZM18 6C18.5523 6 19 6.44772 19 7C19 7.55228 18.5523 8 18 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H18Z"
                              fill="url(#paint0_settings_glass)"
                            />
                          </g>
                          <mask
                            id="mask1_settings_glass"
                            style={{ maskType: "luminance" }}
                            maskUnits="userSpaceOnUse"
                            x={2}
                            y={2}
                            width={20}
                            height={20}
                          >
                            <path
                              d="M6.5 12.5C8.98528 12.5 11 14.5147 11 17C11 19.4853 8.98528 21.5 6.5 21.5C4.01472 21.5 2 19.4853 2 17C2 14.5147 4.01472 12.5 6.5 12.5ZM17.5 2.5C19.9853 2.5 22 4.51472 22 7C22 9.48528 19.9853 11.5 17.5 11.5C15.0147 11.5 13 9.48528 13 7C13 4.51472 15.0147 2.5 17.5 2.5Z"
                              fill="white"
                            />
                          </mask>
                          <g mask="url(#mask1_settings_glass)">
                            <g filter="url(#filter0_settings_glass)">
                              <path
                                d="M21 16C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H6C5.44772 18 5 17.5523 5 17C5 16.4477 5.44772 16 6 16H21ZM18 6C18.5523 6 19 6.44772 19 7C19 7.55228 18.5523 8 18 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H18Z"
                                fill="url(#paint1_settings_glass)"
                              />
                            </g>
                          </g>
                          <path
                            d="M6.5 12.5C8.98528 12.5 11 14.5147 11 17C11 19.4853 8.98528 21.5 6.5 21.5C4.01472 21.5 2 19.4853 2 17C2 14.5147 4.01472 12.5 6.5 12.5ZM17.5 2.5C19.9853 2.5 22 4.51472 22 7C22 9.48528 19.9853 11.5 17.5 11.5C15.0147 11.5 13 9.48528 13 7C13 4.51472 15.0147 2.5 17.5 2.5Z"
                            fill="url(#paint2_settings_glass)"
                          />
                          <path
                            d="M21.25 7C21.25 4.92893 19.5711 3.25 17.5 3.25C15.4289 3.25 13.75 4.92893 13.75 7C13.75 9.07107 15.4289 10.75 17.5 10.75V11.5C15.0147 11.5 13 9.48528 13 7C13 4.51472 15.0147 2.5 17.5 2.5C19.9853 2.5 22 4.51472 22 7C22 9.48528 19.9853 11.5 17.5 11.5V10.75C19.5711 10.75 21.25 9.07107 21.25 7Z"
                            fill="url(#paint3_settings_glass)"
                          />
                          <path
                            d="M10.25 17C10.25 14.9289 8.57107 13.25 6.5 13.25C4.42893 13.25 2.75 14.9289 2.75 17C2.75 19.0711 4.42893 20.75 6.5 20.75V21.5C4.01472 21.5 2 19.4853 2 17C2 14.5147 4.01472 12.5 6.5 12.5C8.98528 12.5 11 14.5147 11 17C11 19.4853 8.98528 21.5 6.5 21.5V20.75C8.57107 20.75 10.25 19.0711 10.25 17Z"
                            fill="url(#paint4_settings_glass)"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_settings_glass"
                            x={-2}
                            y={2}
                            width={28}
                            height={20}
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood
                              floodOpacity={0}
                              result="BackgroundImageFix"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="BackgroundImageFix"
                              result="shape"
                            />
                            <feGaussianBlur
                              stdDeviation={2}
                              result="effect1_foregroundBlur_settings"
                            />
                          </filter>
                          <linearGradient
                            id="paint0_settings_glass"
                            x1={12}
                            y1={-0.5}
                            x2={12}
                            y2={18}
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#575757" />
                            <stop offset={1} stopColor="#151515" />
                          </linearGradient>
                          <linearGradient
                            id="paint1_settings_glass"
                            x1={12}
                            y1={-0.5}
                            x2={12}
                            y2={18}
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#575757" />
                            <stop offset={1} stopColor="#151515" />
                          </linearGradient>
                          <linearGradient
                            id="paint2_settings_glass"
                            x1={12}
                            y1={2.5}
                            x2={12}
                            y2={21.5}
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop
                              stopColor="var(--settings-glass-1)"
                              stopOpacity={0.6}
                            />
                            <stop
                              offset={1}
                              stopColor="var(--settings-glass-2)"
                              stopOpacity={0.6}
                            />
                          </linearGradient>
                          <linearGradient
                            id="paint3_settings_glass"
                            x1={17.5}
                            y1={2.5}
                            x2={17.5}
                            y2={7.712}
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="var(--settings-top-1)" />
                            <stop
                              offset={1}
                              stopColor="var(--settings-top-2)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="paint4_settings_glass"
                            x1={6.5}
                            y1={12.5}
                            x2={6.5}
                            y2={17.712}
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="var(--settings-bot-1)" />
                            <stop
                              offset={1}
                              stopColor="var(--settings-bot-2)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <clipPath id="clip0_settings_glass">
                            <rect width={24} height={24} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Custom Styled Flash Icon (Sparkle/Star Glass) */}
                      <button className="flex h-4 w-4 items-center justify-center transition-transform active:scale-95 [--sparkle-bg1:#575757] [--sparkle-bg2:#151515] [--sparkle-glass1:#E3E3E5] [--sparkle-glass2:#BBBBC0] [--sparkle-outline:white] dark:[--sparkle-bg1:#AD8933] dark:[--sparkle-bg2:#241B03] dark:[--sparkle-glass1:#FF8731] dark:[--sparkle-glass2:#FFE877] dark:[--sparkle-outline:white]">
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_flash_glass_v2)">
                            <mask
                              id="mask0_flash_glass_v2"
                              style={{ maskType: "luminance" }}
                              maskUnits="userSpaceOnUse"
                              x={0}
                              y={0}
                              width={16}
                              height={16}
                            >
                              <path d="M16 0H0V16H16V0Z" fill="white" />
                              <path
                                d="M10.6667 5.33329L9.08417 1.39815C8.69457 0.416528 7.30524 0.416406 6.91544 1.39797L5.37373 5.28056C5.35679 5.32311 5.32317 5.35672 5.28063 5.37366L1.39736 6.91567C0.415888 7.3054 0.415887 8.69453 1.39735 9.08427L5.33337 10.6667C8.27891 10.6667 10.6667 8.2788 10.6667 5.33329Z"
                                fill="black"
                              />
                            </mask>
                            <g mask="url(#mask0_flash_glass_v2)">
                              <path
                                d="M5.33329 10.6666L6.91583 14.6017C7.30543 15.5834 8.69476 15.5835 9.08449 14.6019L10.6262 10.7193C10.6432 10.6768 10.6768 10.6432 10.7194 10.6263L14.6026 9.08428C15.5841 8.69455 15.5841 7.30542 14.6026 6.91568L10.6666 5.33328C7.70536 5.31107 5.31038 7.70535 5.33329 10.6666Z"
                                fill="url(#paint0_flash_glass_v2)"
                              />
                            </g>
                            <mask
                              id="mask1_flash_glass_v2"
                              style={{ maskType: "luminance" }}
                              maskUnits="userSpaceOnUse"
                              x={0}
                              y={0}
                              width={11}
                              height={11}
                            >
                              <path
                                d="M10.6667 5.33329L9.08417 1.39815C8.69457 0.416528 7.30524 0.416406 6.91544 1.39797L5.37373 5.28056C5.35679 5.32311 5.32317 5.35672 5.28063 5.37366L1.39736 6.91567C0.415888 7.3054 0.415887 8.69453 1.39735 9.08427L5.33337 10.6667C8.27891 10.6667 10.6667 8.2788 10.6667 5.33329Z"
                                fill="white"
                              />
                            </mask>
                            <g mask="url(#mask1_flash_glass_v2)">
                              <g filter="url(#filter0_flash_glass_v2)">
                                <path
                                  d="M5.33342 10.6666L6.91595 14.6017C7.30555 15.5834 8.69488 15.5835 9.08461 14.6019L10.6263 10.7193C10.6433 10.6768 10.6769 10.6432 10.7195 10.6263L14.6027 9.08428C15.5842 8.69455 15.5842 7.30542 14.6027 6.91568L10.6667 5.33328C7.70548 5.31107 5.3105 7.70535 5.33342 10.6666Z"
                                  fill="url(#paint1_flash_glass_v2)"
                                />
                              </g>
                            </g>
                            <path
                              d="M10.6667 5.33329L9.08417 1.39815C8.69457 0.416528 7.30524 0.416406 6.91544 1.39797L5.37373 5.28056C5.35679 5.32311 5.32317 5.35672 5.28063 5.37366L1.39736 6.91567C0.415888 7.3054 0.415887 8.69453 1.39735 9.08427L5.33337 10.6667C8.27891 10.6667 10.6667 8.2788 10.6667 5.33329Z"
                              fill="url(#paint2_flash_glass_v2)"
                            />
                            <path
                              d="M6.91511 1.39818C7.30484 0.416624 8.69477 0.416555 9.08437 1.39818L10.2334 4.2556C10.5196 4.96728 10.707 5.73697 10.542 6.48607L10.4964 6.67424C9.99651 8.60464 8.44264 10.111 6.48539 10.542L6.34477 10.5688C5.73461 10.6678 5.11444 10.5447 4.52576 10.3357L4.25623 10.2334L1.39751 9.08437C0.446625 8.70677 0.416707 7.39091 1.30831 6.95484L1.39751 6.91577L5.28031 5.37344C5.32286 5.3565 5.35647 5.32289 5.37341 5.28034L6.91511 1.39818ZM8.61951 1.58243C8.39684 1.02158 7.60264 1.02157 7.37991 1.58243L5.83826 5.46524C5.77898 5.61413 5.66839 5.73613 5.52771 5.80964L5.46521 5.83829L1.58175 7.38057C1.02107 7.60337 1.02101 8.39684 1.58175 8.61951L1.5837 8.62017L4.44243 9.76991C5.11982 10.0422 5.77522 10.1865 6.37797 10.0538C8.20817 9.65071 9.65057 8.20818 10.0538 6.378C10.1864 5.77516 10.0417 5.11991 9.76924 4.44245L8.62017 1.58438L8.61951 1.58243Z"
                              fill="url(#paint3_flash_glass_v2)"
                            />
                          </g>
                          <defs>
                            <filter
                              id="filter0_flash_glass_v2"
                              x={1.33325}
                              y={1.33313}
                              width={18.0056}
                              height={18.005}
                              filterUnits="userSpaceOnUse"
                              colorInterpolationFilters="sRGB"
                            >
                              <feFlood
                                floodOpacity={0}
                                result="BackgroundImageFix"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                              />
                              <feGaussianBlur
                                stdDeviation={2}
                                result="effect1_foregroundBlur_flash_v2"
                              />
                            </filter>
                            <linearGradient
                              id="paint0_flash_glass_v2"
                              x1={10.336}
                              y1={5.33328}
                              x2={10.336}
                              y2={15.338}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="var(--sparkle-bg1)" />
                              <stop offset={1} stopColor="var(--sparkle-bg2)" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_flash_glass_v2"
                              x1={10.3361}
                              y1={5.33328}
                              x2={10.3361}
                              y2={15.338}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="var(--sparkle-bg1)" />
                              <stop offset={1} stopColor="var(--sparkle-bg2)" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_flash_glass_v2"
                              x1={5.66404}
                              y1={0.662}
                              x2={5.66404}
                              y2={10.6667}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop
                                stopColor="var(--sparkle-glass1)"
                                stopOpacity={0.6}
                              />
                              <stop
                                offset={1}
                                stopColor="var(--sparkle-glass2)"
                                stopOpacity={0.6}
                              />
                            </linearGradient>
                            <linearGradient
                              id="paint3_flash_glass_v2"
                              x1={5.63271}
                              y1={0.662041}
                              x2={5.63271}
                              y2={6.41937}
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="var(--sparkle-outline)" />
                              <stop
                                offset={1}
                                stopColor="var(--sparkle-outline)"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <clipPath id="clip0_flash_glass_v2">
                              <rect width={16} height={16} fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                      <span className="text-[14px] text-zinc-500 dark:text-zinc-400 select-none">
                        AI Assistant
                      </span>
                    </div>
                  </div>
                </div>

                {/* Custom Arrow/Enter Button */}
                <button className="transition-transform active:scale-95">
                  <svg
                    width={97}
                    height={38}
                    viewBox="0 0 97 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 14V20C7.5 20.2967 7.58797 20.5867 7.7528 20.8334C7.91762 21.08 8.15189 21.2723 8.42598 21.3858C8.70006 21.4994 9.00166 21.5291 9.29264 21.4712C9.58361 21.4133 9.85088 21.2704 10.0607 21.0607C10.2704 20.8509 10.4133 20.5836 10.4712 20.2926C10.5291 20.0017 10.4994 19.7001 10.3858 19.426C10.2723 19.1519 10.08 18.9176 9.83336 18.7528C9.58668 18.588 9.29667 18.5 9 18.5H3C2.70333 18.5 2.41332 18.588 2.16665 18.7528C1.91997 18.9176 1.72771 19.1519 1.61418 19.426C1.50065 19.7001 1.47094 20.0017 1.52882 20.2926C1.5867 20.5836 1.72956 20.8509 1.93934 21.0607C2.14912 21.2704 2.41639 21.4133 2.70737 21.4712C2.99834 21.5291 3.29994 21.4994 3.57403 21.3858C3.84812 21.2723 4.08238 21.08 4.24721 20.8334C4.41203 20.5867 4.5 20.2967 4.5 20V14C4.5 13.7033 4.41203 13.4133 4.24721 13.1666C4.08238 12.92 3.84812 12.7277 3.57403 12.6142C3.29994 12.5006 2.99834 12.4709 2.70737 12.5288C2.41639 12.5867 2.14912 12.7296 1.93934 12.9393C1.72956 13.1491 1.5867 13.4164 1.52882 13.7074C1.47094 13.9983 1.50065 14.2999 1.61418 14.574C1.72771 14.8481 1.91997 15.0824 2.16665 15.2472C2.41332 15.412 2.70333 15.5 3 15.5H9C9.29667 15.5 9.58668 15.412 9.83336 15.2472C10.08 15.0824 10.2723 14.8481 10.3858 14.574C10.4994 14.2999 10.5291 13.9983 10.4712 13.7074C10.4133 13.4164 10.2704 13.1491 10.0607 12.9393C9.85088 12.7296 9.58361 12.5867 9.29264 12.5288C9.00166 12.4709 8.70006 12.5006 8.42598 12.6142C8.15189 12.7277 7.91762 12.92 7.7528 13.1666C7.58797 13.4133 7.5 13.7033 7.5 14Z"
                      stroke="#807F7F"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.4773 19.9659V14.3409H20.4318V19.9659H19.4773ZM17.142 17.6307V16.6761H22.767V17.6307H17.142ZM27.382 21.5V12.7727H32.649V13.7102H28.4388V16.6591H32.3763V17.5966H28.4388V20.5625H32.7172V21.5H27.382ZM34.9432 17.5625V21.5H33.9375V14.9545H34.9091V15.9773H34.9943C35.1477 15.6449 35.3807 15.3778 35.6932 15.1761C36.0057 14.9716 36.4091 14.8693 36.9034 14.8693C37.3466 14.8693 37.7344 14.9602 38.0667 15.142C38.3991 15.321 38.6577 15.5938 38.8423 15.9602C39.027 16.3239 39.1193 16.7841 39.1193 17.3409V21.5H38.1136V17.4091C38.1136 16.8949 37.9801 16.4943 37.7131 16.2074C37.446 15.9176 37.0795 15.7727 36.6136 15.7727C36.2926 15.7727 36.0057 15.8423 35.7528 15.9815C35.5028 16.1207 35.3054 16.3239 35.1605 16.5909C35.0156 16.858 34.9432 17.1818 34.9432 17.5625ZM43.3236 14.9545V15.8068H39.9316V14.9545H43.3236ZM40.9202 13.3864H41.9259V19.625C41.9259 19.9091 41.9671 20.1222 42.0495 20.2642C42.1347 20.4034 42.2426 20.4972 42.3733 20.5455C42.5068 20.5909 42.6475 20.6136 42.7952 20.6136C42.906 20.6136 42.9969 20.608 43.0679 20.5966C43.1389 20.5824 43.1958 20.571 43.2384 20.5625L43.4429 21.4659C43.3747 21.4915 43.2796 21.517 43.1574 21.5426C43.0353 21.571 42.8804 21.5852 42.6929 21.5852C42.4088 21.5852 42.1304 21.5241 41.8577 21.402C41.5878 21.2798 41.3634 21.0938 41.1844 20.8438C41.0083 20.5938 40.9202 20.2784 40.9202 19.8977V13.3864ZM47.0304 21.6364C46.3997 21.6364 45.8557 21.4972 45.3983 21.2188C44.9438 20.9375 44.5929 20.5455 44.3457 20.0426C44.1014 19.5369 43.9793 18.9489 43.9793 18.2784C43.9793 17.608 44.1014 17.017 44.3457 16.5057C44.5929 15.9915 44.9366 15.5909 45.377 15.304C45.8202 15.0142 46.3372 14.8693 46.9281 14.8693C47.269 14.8693 47.6057 14.9261 47.9381 15.0398C48.2705 15.1534 48.573 15.3381 48.8457 15.5938C49.1185 15.8466 49.3358 16.1818 49.4977 16.5994C49.6597 17.017 49.7406 17.5312 49.7406 18.142V18.5682H44.6952V17.6989H48.7179C48.7179 17.3295 48.644 17 48.4963 16.7102C48.3514 16.4205 48.144 16.1918 47.8741 16.0241C47.6071 15.8565 47.2918 15.7727 46.9281 15.7727C46.5276 15.7727 46.181 15.8722 45.8884 16.071C45.5986 16.267 45.3756 16.5227 45.2193 16.8381C45.0631 17.1534 44.9849 17.4915 44.9849 17.8523V18.4318C44.9849 18.9261 45.0702 19.3452 45.2406 19.6889C45.4139 20.0298 45.654 20.2898 45.9608 20.4688C46.2676 20.6449 46.6241 20.733 47.0304 20.733C47.2946 20.733 47.5332 20.696 47.7463 20.6222C47.9622 20.5455 48.1483 20.4318 48.3045 20.2812C48.4608 20.1278 48.5815 19.9375 48.6668 19.7102L49.6384 19.983C49.5361 20.3125 49.3642 20.6023 49.1227 20.8523C48.8813 21.0994 48.583 21.2926 48.2278 21.4318C47.8727 21.5682 47.4736 21.6364 47.0304 21.6364ZM50.7905 21.5V14.9545H51.762V15.9432H51.8302C51.9495 15.6193 52.1655 15.3565 52.478 15.1548C52.7905 14.9531 53.1427 14.8523 53.5348 14.8523C53.6086 14.8523 53.701 14.8537 53.8118 14.8565C53.9226 14.8594 54.0064 14.8636 54.0632 14.8693V15.892C54.0291 15.8835 53.951 15.8707 53.8288 15.8537C53.7095 15.8338 53.5831 15.8239 53.4495 15.8239C53.1314 15.8239 52.8473 15.8906 52.5973 16.0241C52.3501 16.1548 52.1541 16.3366 52.0092 16.5696C51.8672 16.7997 51.7961 17.0625 51.7961 17.358V21.5H50.7905Z"
                      fill="#807F7F"
                    />
                    <g
                      filter="url(#filter_enter_arrow)"
                      className="dark:[filter:url(#filter_enter_arrow_dark)]"
                    >
                      <rect
                        x={67}
                        y={2}
                        width={30}
                        height={30}
                        rx={8}
                        fill="#FD5E29"
                        className="dark:fill-[url(#paint_enter_button_bg_dark)]"
                      />
                      <rect
                        x={68}
                        y={3}
                        width={28}
                        height={28}
                        rx={7}
                        stroke="#FEB31D"
                        className="dark:stroke-[#27780A]"
                        strokeWidth={2}
                      />
                      <path
                        d="M75 17L82 10M82 10L89 17M82 10V24"
                        stroke="#F9F9F9"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint_enter_button_bg_dark"
                        x1={82}
                        y1={2}
                        x2={82}
                        y2={32}
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#157714" />
                        <stop offset={1} stopColor="#1A4107" />
                      </linearGradient>
                      <filter
                        id="filter_enter_arrow"
                        x={67}
                        y={-2}
                        width={40}
                        height={46}
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        {/* Drop Shadow Calculation */}
                        <feFlood floodOpacity={0} result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          result="shadowAlpha"
                        />
                        <feOffset
                          in="shadowAlpha"
                          dx={0}
                          dy={2}
                          result="shadowOffset"
                        />
                        <feGaussianBlur
                          in="shadowOffset"
                          stdDeviation={1}
                          result="shadowBlur"
                        />

                        {/* Inner Shadow Logic (Existing) */}
                        <feColorMatrix
                          in="SourceGraphic"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy={-4} />
                        <feGaussianBlur stdDeviation={2} />
                        <feComposite
                          in2="hardAlpha"
                          operator="arithmetic"
                          k2={-1}
                          k3={1}
                          result="innerShadowMask"
                        />
                        <feColorMatrix
                          in="innerShadowMask"
                          type="matrix"
                          values="0 0 0 0 1 0 0 0 0 0.851227 0 0 0 0 0.782283 0 0 0 0.5 0"
                          result="innerShadowColor"
                        />
                        <feBlend
                          mode="normal"
                          in="innerShadowColor"
                          in2="SourceGraphic"
                          result="buttonWithInner"
                        />
                        <feBlend
                          mode="normal"
                          in="buttonWithInner"
                          in2="shadowBlur"
                          result="final"
                        />
                      </filter>
                      <filter
                        id="filter_enter_arrow_dark"
                        x={67}
                        y={-2}
                        width={40}
                        height={46}
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity={0} result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          result="shadowAlpha"
                        />
                        <feOffset
                          in="shadowAlpha"
                          dx={0}
                          dy={2}
                          result="shadowOffset"
                        />
                        <feGaussianBlur
                          in="shadowOffset"
                          stdDeviation={1}
                          result="shadowBlur"
                        />

                        <feColorMatrix
                          in="SourceGraphic"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy={-4} />
                        <feGaussianBlur stdDeviation={4} />
                        <feComposite
                          in2="hardAlpha"
                          operator="arithmetic"
                          k2={-1}
                          k3={1}
                          result="innerShadowMask"
                        />
                        <feColorMatrix
                          in="innerShadowMask"
                          type="matrix"
                          values="0 0 0 0 0.6745 0 0 0 0 0.9529 0 0 0 0 0.6784 0 0 0 0.5 0"
                          result="innerShadowColor"
                        />
                        <feBlend
                          mode="normal"
                          in="innerShadowColor"
                          in2="SourceGraphic"
                          result="buttonWithInner"
                        />
                        <feBlend
                          mode="normal"
                          in="buttonWithInner"
                          in2="shadowBlur"
                          result="final"
                        />
                      </filter>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>

            {/* Bottom Upgrade Bar */}
            <div className="flex items-center justify-center gap-4 py-2 text-[13px]">
              <span className="font-medium text-zinc-500 dark:text-zinc-400">
                Upgrade to Team to unlock
              </span>
              <button className="font-medium text-[#0EC235] hover:underline dark:text-[#10D6E4]">
                Upgrade Plan
              </button>
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
              <Label className="text-[12px] font-medium text-[#18181B] dark:text-orange-300">
                Content Type
              </Label>
              <Select defaultValue="social-media">
                <SelectTrigger className="h-[40px] rounded-lg border-[#E3E3E6] bg-white text-[14px] shadow-[0_2px_2px_0_rgba(0,0,0,0.15)] focus:ring-1 focus:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent
                  side="bottom"
                  align="start"
                  className="rounded-lg dark:bg-zinc-900 dark:border-zinc-800"
                >
                  <SelectItem value="social-media">
                    Social Media Post
                  </SelectItem>
                  <SelectItem value="blog-post">Blog Post</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="email">Email Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[12px] font-medium text-[#18181B] dark:text-cyan-300">
                Topic / Product
              </Label>
              <Input
                defaultValue="Benefits of Remote Jobs"
                className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-[0_2px_2px_0_rgba(0,0,0,0.15)] focus-visible:ring-1 focus-visible:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[12px] font-medium text-[#18181B] dark:text-violet-300">
                Key Points (oner per line)
              </Label>
              <Textarea
                defaultValue={`Increased flexibility and work-life balance\nAccess to a global talent pool for companies\nReduced commuting time and costs`}
                className="min-h-[120px] resize-none rounded-lg border-[#E3E3E6] py-3 text-[14px] leading-relaxed shadow-[0_2px_2px_0_rgba(0,0,0,0.15)] focus-visible:ring-1 focus-visible:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[12px] font-medium text-[#18181B] dark:text-emerald-300">
                Target Audience
              </Label>
              <Input
                defaultValue="Benefits of Remote Jobs"
                className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-[0_2px_2px_0_rgba(0,0,0,0.15)] focus-visible:ring-1 focus-visible:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label className="text-[12px] font-medium text-[#18181B] dark:text-emerald-300">
                  Tone
                </Label>
                <Select defaultValue="informative">
                  <SelectTrigger className="h-[40px] rounded-lg border-[#E3E3E6] bg-white text-[14px] shadow-[0_2px_2px_0_rgba(0,0,0,0.15)] focus:ring-1 focus:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent
                    side="bottom"
                    align="start"
                    className="rounded-lg dark:bg-zinc-900 dark:border-zinc-800"
                  >
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-[12px] font-medium text-[#18181B] dark:text-emerald-300">
                  Length
                </Label>
                <Input
                  defaultValue="500 words"
                  className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-[0_2px_2px_0_rgba(0,0,0,0.15)] focus-visible:ring-1 focus-visible:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[12px] font-medium text-[#18181B] dark:text-pink-300">
                Keywords (Optional)
              </Label>
              <Input
                defaultValue="remote work, productivity"
                className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-[0_2px_2px_0_rgba(0,0,0,0.15)] focus-visible:ring-1 focus-visible:ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
              />
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <Button className="relative flex h-12 w-full items-center justify-center gap-3 rounded-[16px] border-2 border-[#18181B] bg-[#18181B] text-white transition-all duration-200 hover:bg-[#18181B]/95 active:scale-[0.98] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.1)] dark:border-[#AEFF62] dark:bg-gradient-to-b dark:from-[#0F6107] dark:to-[#7CBB66] dark:text-white dark:hover:opacity-90 dark:shadow-[inset_0_2px_4px_rgba(15,97,7,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]">
              {/* Light Mode Icon */}
              <IconSparkle className="size-4 text-white dark:hidden" />

              {/* Dark Mode Icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 hidden dark:block"
              >
                <g clipPath="url(#sparkle_clip)">
                  <mask
                    id="sparkle_mask"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <path d="M24 0H0V24H24V0Z" fill="white" />
                    <path
                      d="M16.6562 9.21227L14.3939 3.51197C13.893 2.24988 12.1067 2.24972 11.6056 3.51173L9.34196 9.21227C9.31836 9.27154 9.27155 9.31835 9.21228 9.34195L3.51087 11.6059C2.24898 12.107 2.24898 13.893 3.51087 14.3941L9.21228 16.6581C9.27155 16.6817 9.31836 16.7285 9.34196 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34195C16.7273 9.31841 16.6799 9.27174 16.6562 9.21227Z"
                      fill="black"
                    />
                  </mask>
                  <g mask="url(#sparkle_mask)">
                    <path
                      d="M13.0001 9.00529C13.5523 9.00529 14 9.45306 14.0001 10.0053V12.0053H16.0001C16.5523 12.0053 17 12.4531 17.0001 13.0053C16.9999 13.5574 16.5522 14.0053 16.0001 14.0053H14.0001V16.0053C13.9999 16.5574 13.5522 17.0053 13.0001 17.0053C12.448 17.0053 12.0003 16.5574 12.0001 16.0053V14.0053H10.0001C9.448 14.0053 9.00034 13.5574 9.00009 13.0053C9.00016 12.4531 9.44789 12.0054 10.0001 12.0053H12.0001V10.0053C12.0002 9.45309 12.4479 9.00534 13.0001 9.00529ZM6.0704 1.34123C6.40449 0.499893 7.59584 0.499834 7.92978 1.34123L9.25009 4.66935C9.26462 4.70569 9.29382 4.73394 9.33017 4.74845L12.6593 6.07072C13.5006 6.40475 13.5006 7.59507 12.6593 7.92912L9.33017 9.25138C9.29383 9.26588 9.26463 9.29417 9.25009 9.33049L7.92978 12.6586C7.59584 13.5 6.40449 13.5 6.0704 12.6586L4.74911 9.33049C4.73455 9.29416 4.7054 9.26586 4.66904 9.25138L1.34091 7.92912C0.499646 7.59507 0.499646 6.40477 1.34091 6.07072L4.66904 4.74845C4.70542 4.73397 4.73456 4.7057 4.74911 4.66935L6.0704 1.34123Z"
                      fill="url(#paint0_sparkle)"
                    />
                  </g>
                  <path
                    d="M16.6562 9.21227L14.3939 3.51197C13.893 2.24988 12.1067 2.24972 11.6056 3.51173L9.34196 9.21227C9.31836 9.27154 9.27155 9.31835 9.21228 9.34195L3.51087 11.6059C2.24898 12.107 2.24898 13.893 3.51087 14.3941L9.21228 16.6581C9.27155 16.6817 9.31836 16.7285 9.34196 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34195C16.7273 9.31841 16.6799 9.27174 16.6562 9.21227Z"
                    fill="url(#paint1_sparkle)"
                  />
                  <path
                    d="M11.6054 3.51174C12.1064 2.24985 13.8924 2.24997 14.3934 3.51174L16.6561 9.21194C16.6798 9.27141 16.7275 9.31828 16.787 9.34182L22.4882 11.6055C23.7501 12.1065 23.7501 13.8935 22.4882 14.3946L16.787 16.6582L16.745 16.6797C16.7052 16.7056 16.6739 16.7433 16.6561 16.7881L14.3934 22.4883L14.3427 22.6026C13.8 23.7118 12.1987 23.712 11.6561 22.6026L11.6054 22.4883L9.34168 16.7881C9.31809 16.7288 9.27106 16.6818 9.2118 16.6582L3.51063 14.3946C2.24874 13.8935 2.24874 12.1066 3.51063 11.6055L9.2118 9.34182C9.27106 9.31822 9.31809 9.2712 9.34168 9.21194L11.6054 3.51174ZM13.6972 3.78909C13.4468 3.15817 12.5534 3.15751 12.3026 3.78811L10.0389 9.48928C9.95156 9.70875 9.78837 9.88881 9.58094 9.99709L9.48914 10.0391L3.78797 12.3028C3.15702 12.5533 3.15703 13.4467 3.78797 13.6973L9.48914 15.961C9.70861 16.0483 9.88867 16.2115 9.99695 16.419L10.0389 16.5108L12.3026 22.2119C12.5534 22.8425 13.4458 22.8419 13.6962 22.211L15.9589 16.5108L16.0018 16.418C16.1117 16.2083 16.2930 16.047 16.5097 15.961L22.2118 13.6973C22.8428 13.4468 22.8428 12.5533 22.2118 12.3028L16.5097 10.0391C16.2931 9.95306 16.1116 9.79167 16.0018 9.58205L15.9589 9.48928L13.6972 3.78909Z"
                    fill="url(#paint2_sparkle)"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_sparkle"
                    x1="8.85509"
                    y1="0.709981"
                    x2="8.85509"
                    y2="13.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#575757" />
                    <stop offset="1" stopColor="#151515" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_sparkle"
                    x1="13"
                    y1="0.00000500753"
                    x2="13"
                    y2="26"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#E3E3E5" stopOpacity={0.6} />
                    <stop offset="1" stopColor="#BBBBC0" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient
                    id="paint2_sparkle"
                    x1="12.999"
                    y1="2.565"
                    x2="12.999"
                    y2="13.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity={0} />
                  </linearGradient>
                  <clipPath id="sparkle_clip">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-[14px] font-medium">Generate Content</span>
            </Button>
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
  );
}
