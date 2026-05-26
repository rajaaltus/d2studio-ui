"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface D2ToggleProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  width?: number;
  height?: number;
  animated?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function D2Toggle({
  checked,
  onCheckedChange,
  width = 51,
  height = 30,
  animated = true,
  className,
  "aria-label": ariaLabel,
}: D2ToggleProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "");

  const ids = {
    bg: `d2t-bg-${uid}`,
    innerShadow: `d2t-innerShadow-${uid}`,
    overlayFilter: `d2t-overlayFilter-${uid}`,
    overlayGrad: `d2t-overlayGrad-${uid}`,
    thumbShadow: `d2t-thumbShadow-${uid}`,
    thumbHi: `d2t-thumbHi-${uid}`,
    thumbBg: `d2t-thumbBg-${uid}`,
    hi: `d2t-hi-${uid}`,
    thumbBorder: `d2t-thumbBorder-${uid}`,
    sparkleStroke: `d2t-sparkleStroke-${uid}`,
    glowColor: `d2t-glowColor-${uid}`,
    glowLight: `d2t-glowLight-${uid}`,
    clip: `d2t-clip-${uid}`,
  };

  const dark = checked;
  const thumbOffset = dark ? 0 : -44;

  const palette = dark
    ? {
        bgStart: "#4B4B4B",
        bgEnd: "#353535",
        innerFill: "#ABABAB",
        innerFillOpacity: 0.2,
        innerStroke: "#A8A8A8",
        innerStrokeOpacity: 0.3,
        icon: "#D0D0D0",
        iconOpacity: 1,
        innerShadowOpacity: 0.25,
        thumbShadowOpacity: 1,
        thumbBgStart: "#363336",
        thumbBgEnd: "#646464",
      }
    : {
        bgStart: "#D4D4D8",
        bgEnd: "#A1A1AA",
        innerFill: "#F4F4F5",
        innerFillOpacity: 1,
        innerStroke: "#A8A8A8",
        innerStrokeOpacity: 0.5,
        icon: "#52525B",
        iconOpacity: 0.85,
        innerShadowOpacity: 0.12,
        thumbShadowOpacity: 0.18,
        thumbBgStart: "#528DF9",
        thumbBgEnd: "#FF79B1",
      };

  return (
    <button
      type="button"
      onClick={() => onCheckedChange?.(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      suppressHydrationWarning
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 102 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        style={{
          shapeRendering: "geometricPrecision",
          imageRendering: "auto",
        }}
        aria-hidden
      >
        <rect
          x={4}
          y={6}
          width={94}
          height={48}
          rx={24}
          fill="var(--input)"
          stroke="var(--border)"
        />

        <path
          d="M29 22V23.6M29 36.4V38M23.344 24.344L24.472 25.472M33.528 34.528L34.656 35.656M21 30H22.6M35.4 30H37M24.472 34.528L23.344 35.656M34.656 24.344L33.528 25.472M32.2 30C32.2 31.7673 30.7673 33.2 29 33.2C27.2327 33.2 25.8 31.7673 25.8 30C25.8 28.2327 27.2327 26.8 29 26.8C30.7673 26.8 32.2 28.2327 32.2 30Z"
          transform="matrix(1.25 0 0 1.25 -7.25 -7.5)"
          stroke={palette.icon}
          strokeOpacity={palette.iconOpacity}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <g filter={`url(#${ids.innerShadow})`}>
          <rect
            x={8}
            y={10}
            width={86}
            height={40}
            rx={20}
            fill={palette.innerFill}
            fillOpacity={palette.innerFillOpacity}
          />
        </g>
        <rect
          x={8.5}
          y={10.5}
          width={85}
          height={39}
          rx={19.5}
          stroke={palette.innerStroke}
          strokeOpacity={palette.innerStrokeOpacity}
        />

        {dark && (
          <g
            filter={`url(#${ids.overlayFilter})`}
            style={{ mixBlendMode: "color-dodge" }}
          >
            <rect
              x={17}
              y={12}
              width={41}
              height={36}
              fill={`url(#${ids.overlayGrad})`}
              fillOpacity={0.3}
            />
          </g>
        )}

        {!dark && (
          <g fillOpacity={palette.iconOpacity}>
            <path
              d="M72.9998 29.807C71.7415 28.5483 70.8846 26.9448 70.5374 25.1993C70.1901 23.4538 70.3681 21.6444 71.0487 20C69.108 20.3821 67.3254 21.3343 65.9288 22.735C62.0238 26.64 62.0238 32.972 65.9288 36.877C69.8347 40.783 76.1658 40.782 80.0718 36.877C81.4721 35.4805 82.4243 33.6983 82.8067 31.758C81.1623 32.4385 79.353 32.6164 77.6075 32.2692C75.862 31.9219 74.2585 31.0651 72.9998 29.807Z"
              fill={palette.icon}
            />
            <path
              d="M77.75 22C78.1642 22 78.5 22.3358 78.5 22.75V25.0039H80.75C81.1642 25.0039 81.5 25.3397 81.5 25.7539C81.5 26.1681 81.1642 26.5039 80.75 26.5039H78.5V28.75C78.5 29.1642 78.1642 29.5 77.75 29.5C77.3358 29.5 77 29.1642 77 28.75V26.5039H74.75C74.3358 26.5039 74 26.1681 74 25.7539C74 25.3397 74.3358 25.0039 74.75 25.0039H77V22.75C77 22.3358 77.3358 22 77.75 22Z"
              fill={palette.icon}
            />
          </g>
        )}

        <motion.g
          initial={false}
          animate={{ x: thumbOffset }}
          transition={
            animated
              ? { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
              : { duration: 0 }
          }
          suppressHydrationWarning
        >
          <g filter={`url(#${ids.thumbShadow})`}>
            <g clipPath={`url(#${ids.clip})`}>
              <rect
                x={56}
                y={13}
                width={34}
                height={34}
                rx={17}
                fill={`url(#${ids.thumbBg})`}
              />
              <motion.g
                initial={false}
                animate={{
                  scale: dark ? 1 : 0,
                  rotate: dark ? 0 : 360,
                }}
                transition={
                  animated
                    ? {
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                        delay: dark ? 0.2 : 0,
                      }
                    : { duration: 0 }
                }
                style={{
                  transformBox: "view-box",
                  transformOrigin: "73px 30px",
                }}
              >
                <path
                  d="M72.9998 29.807C71.7415 28.5483 70.8846 26.9448 70.5374 25.1993C70.1901 23.4538 70.3681 21.6444 71.0487 20C69.108 20.3821 67.3254 21.3343 65.9288 22.735C62.0238 26.64 62.0238 32.972 65.9288 36.877C69.8347 40.783 76.1658 40.782 80.0718 36.877C81.4721 35.4805 82.4243 33.6983 82.8067 31.758C81.1623 32.4385 79.353 32.6164 77.6075 32.2692C75.862 31.9219 74.2585 31.0651 72.9998 29.807Z"
                  fill="white"
                />
                <path
                  d="M77.75 22C78.1642 22 78.5 22.3358 78.5 22.75V25.0039H80.75C81.1642 25.0039 81.5 25.3397 81.5 25.7539C81.5 26.1681 81.1642 26.5039 80.75 26.5039H78.5V28.75C78.5 29.1642 78.1642 29.5 77.75 29.5C77.3358 29.5 77 29.1642 77 28.75V26.5039H74.75C74.3358 26.5039 74 26.1681 74 25.7539C74 25.3397 74.3358 25.0039 74.75 25.0039H77V22.75C77 22.3358 77.3358 22 77.75 22Z"
                  fill="white"
                />
                <path
                  d="M77.75 22V21.5V21.5V22ZM78.5 22.75H78H78.5ZM78.5 25.0039H78V25.5039H78.5V25.0039ZM78.5 26.5039V26.0039H78V26.5039H78.5ZM78.5 28.75H79V28.75H78.5ZM77.75 29.5V30H77.75L77.75 29.5ZM77 28.75H77.5H77ZM77 26.5039H77.5V26.0039H77V26.5039ZM74 25.7539H73.5H74ZM77 25.0039V25.5039H77.5V25.0039H77ZM77 22.75H76.5V22.75H77ZM77.75 22V22.5C77.8881 22.5 78 22.6119 78 22.75H78.5H79C79 22.0596 78.4404 21.5 77.75 21.5V22ZM78.5 22.75H78V25.0039H78.5H79V22.75H78.5ZM78.5 25.0039V25.5039H80.75V25.0039V24.5039H78.5V25.0039ZM80.75 25.0039V25.5039C80.8881 25.5039 81 25.6158 81 25.7539H81.5H82C82 25.0636 81.4404 24.5039 80.75 24.5039V25.0039ZM81.5 25.7539H81C81 25.892 80.8881 26.0039 80.75 26.0039V26.5039V27.0039C81.4404 27.0039 82 26.4443 82 25.7539H81.5ZM80.75 26.5039V26.0039H78.5V26.5039V27.0039H80.75V26.5039ZM78.5 26.5039H78V28.75H78.5H79V26.5039H78.5ZM78.5 28.75H78C78 28.8881 77.8881 29 77.75 29L77.75 29.5L77.75 30C78.4404 30 79 29.4404 79 28.75H78.5ZM77.75 29.5V29C77.6119 29 77.5 28.8881 77.5 28.75H77H76.5C76.5 29.4404 77.0596 30 77.75 30V29.5ZM77 28.75H77.5V26.5039H77H76.5V28.75H77ZM77 26.5039V26.0039H74.75V26.5039V27.0039H77V26.5039ZM74.75 26.5039V26.0039C74.6119 26.0039 74.5 25.892 74.5 25.7539H74H73.5C73.5 26.4443 74.0596 27.0039 74.75 27.0039V26.5039ZM74 25.7539H74.5C74.5 25.6158 74.6119 25.5039 74.75 25.5039V25.0039V24.5039C74.0596 24.5039 73.5 25.0636 73.5 25.7539H74ZM74.75 25.0039V25.5039H77V25.0039V24.5039H74.75V25.0039ZM77 25.0039H77.5V22.75H77H76.5V25.0039H77ZM77 22.75H77.5C77.5 22.6119 77.6119 22.5 77.75 22.5V22V21.5C77.0596 21.5 76.5 22.0596 76.5 22.5V22.5V22.75H77Z"
                  fill={`url(#${ids.sparkleStroke})`}
                />
              </motion.g>
              <motion.g
                initial={false}
                animate={{
                  scale: dark ? 0 : 1,
                  rotate: dark ? 0 : 360,
                }}
                transition={
                  animated
                    ? {
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                        delay: dark ? 0 : 0.2,
                      }
                    : { duration: 0 }
                }
                style={{
                  transformBox: "view-box",
                  transformOrigin: "73px 30px",
                }}
              >
                <path
                  d="M73 22V23.6M73 36.4V38M67.344 24.344L68.472 25.472M77.528 34.528L78.656 35.656M65 30H66.6M79.4 30H81M68.472 34.528L67.344 35.656M78.656 24.344L77.528 25.472M76.2 30C76.2 31.7673 74.7673 33.2 73 33.2C71.2327 33.2 69.8 31.7673 69.8 30C69.8 28.2327 71.2327 26.8 73 26.8C74.7673 26.8 76.2 28.2327 76.2 30Z"
                  stroke="#F5FBFF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
              <g
                filter={`url(#${ids.thumbHi})`}
                style={{ mixBlendMode: "plus-lighter" }}
              >
                <circle
                  cx={73}
                  cy={18}
                  r={9}
                  fill={`url(#${ids.hi})`}
                  fillOpacity={0.7}
                />
              </g>
            </g>
            <rect
              x={56.5}
              y={13.5}
              width={33}
              height={33}
              rx={16.5}
              stroke={`url(#${ids.thumbBorder})`}
            />
          </g>
        </motion.g>

        {dark && (
          <>
            <g
              filter={`url(#${ids.glowColor})`}
              style={{ mixBlendMode: "color" }}
            >
              <ellipse
                cx={51}
                cy={22}
                rx={39}
                ry={9}
                fill="#D9D9D9"
                fillOpacity={0.4}
              />
            </g>
            <g
              filter={`url(#${ids.glowLight})`}
              style={{ mixBlendMode: "plus-lighter" }}
            >
              <ellipse
                cx={51}
                cy={29}
                rx={39}
                ry={9}
                fill="#D9D9D9"
                fillOpacity={0.4}
              />
            </g>
          </>
        )}

        <defs>
          <filter
            id={ids.innerShadow}
            x={1.4}
            y={9}
            width={92.6}
            height={41}
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
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius={2}
              operator="erode"
              in="SourceAlpha"
              result="effect1_innerShadow"
            />
            <feOffset dx={-12} dy={-1} />
            <feGaussianBlur stdDeviation={2.3} />
            <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${palette.innerShadowOpacity} 0`}
            />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          </filter>
          <filter
            id={ids.overlayFilter}
            x={5}
            y={0}
            width={65}
            height={60}
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
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx={6} dy={4} />
            <feGaussianBlur stdDeviation={2} />
            <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0252234 0 0 0 0 0.25308 0 0 0 0 0.203711 0 0 0 0.25 0"
            />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
            <feGaussianBlur stdDeviation={6} result="effect2_foregroundBlur" />
          </filter>
          <filter
            id={ids.thumbShadow}
            x={51.4}
            y={7.4}
            width={49.2}
            height={49.2}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx={3} dy={2} />
            <feGaussianBlur stdDeviation={3.8} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${palette.thumbShadowOpacity} 0`}
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius={2}
              operator="erode"
              in="SourceAlpha"
              result="effect2_innerShadow"
            />
            <feOffset dx={-1} dy={2} />
            <feGaussianBlur stdDeviation={3.5} />
            <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.486816 0 0 0 0 0.88881 0 0 0 0 1 0 0 0 0.5 0"
            />
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
          </filter>
          <filter
            id={ids.thumbHi}
            x={52}
            y={-3}
            width={42}
            height={42}
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
            <feGaussianBlur stdDeviation={6} result="effect1_foregroundBlur" />
          </filter>
          <filter
            id={ids.glowColor}
            x={0}
            y={1}
            width={102}
            height={42}
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
            <feGaussianBlur stdDeviation={6} result="effect1_foregroundBlur" />
          </filter>
          <filter
            id={ids.glowLight}
            x={0}
            y={8}
            width={102}
            height={42}
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
            <feGaussianBlur stdDeviation={6} result="effect1_foregroundBlur" />
          </filter>
          <linearGradient
            id={ids.bg}
            x1={51}
            y1={6}
            x2={51}
            y2={54}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={palette.bgStart} />
            <stop offset={1} stopColor={palette.bgEnd} />
          </linearGradient>
          <linearGradient
            id={ids.thumbBg}
            x1={73}
            y1={13}
            x2={74.5}
            y2={60.5}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={palette.thumbBgStart} />
            <stop offset={1} stopColor={palette.thumbBgEnd} />
          </linearGradient>
          <linearGradient
            id={ids.hi}
            x1={73}
            y1={9}
            x2={73}
            y2={27}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FD9DE5" />
            <stop offset={1} stopColor="#9AA6FF" />
          </linearGradient>
          <linearGradient
            id={ids.thumbBorder}
            x1={73}
            y1={13}
            x2={73}
            y2={47}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset={0.5} stopColor="#C6CCFF" />
            <stop offset={1} stopColor="#4D4D4D" />
          </linearGradient>
          <linearGradient
            id={ids.overlayGrad}
            x1={34.7667}
            y1={17.5}
            x2={51.0945}
            y2={40.8683}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0F5D87" stopOpacity={0.6} />
            <stop offset={0.5} stopColor="#3E0836" stopOpacity={0.6} />
            <stop offset={1} stopColor="#360C53" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient
            id={ids.sparkleStroke}
            x1={77.75}
            y1={22}
            x2={77.75}
            y2={29.5}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset={1} stopColor="#EBEBEB" />
          </linearGradient>
          <clipPath id={ids.clip}>
            <rect x={56} y={13} width={34} height={34} rx={17} fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}
