import React from "react";

interface GoldenRatioSpiralProps {
    className?: string;
    strokeColor?: string;
    fillColor?: string;
    opacity?: number;
}

export default function GoldenRatioSpiral({
    className = "w-full h-full",
    strokeColor = "currentColor",
    fillColor = "none",
    opacity = 0.15,
}: GoldenRatioSpiralProps) {
    return (
        <div className="absolute inset-0" style={{ opacity }}>
            <svg
                viewBox="0 0 1000 618"
                className={className}
                preserveAspectRatio="xMidYMid slice"
            >
                {/* First square (largest) - bottom left, curve going up-right */}
                <rect
                    x="0"
                    y="0"
                    width="618"
                    height="618"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="0"
                    className="text-amber-900"
                />
                <path
                    d="M 0 618 A 618 618 0 0 1 618 0"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="3"
                    className="text-amber-700"
                />

                {/* Second square - top right of first, curve going down */}
                <rect
                    x="618"
                    y="0"
                    width="382"
                    height="382"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="0"
                    className="text-amber-900"
                />
                <path
                    d="M 618 0 A 382 382 0 0 1 1000 382"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="3"
                    className="text-amber-700"
                />

                {/* Third square - bottom right, curve going left */}
                <rect
                    x="618"
                    y="382"
                    width="236"
                    height="236"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                    className="text-amber-900"
                />
                <path
                    d="M 1000 382 A 236 236 0 0 1 764 618"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    className="text-amber-700"
                />

                {/* Fourth square - left side of third, curve going up */}
                <rect
                    x="618"
                    y="382"
                    width="146"
                    height="146"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                    className="text-amber-900"
                />
                <path
                    d="M 764 618 A 146 146 0 0 1 618 472"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    className="text-amber-700"
                />

                {/* Fifth square - top of fourth, curve going right */}
                <rect
                    x="618"
                    y="382"
                    width="90"
                    height="90"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    className="text-amber-900"
                />
                <path
                    d="M 618 472 A 90 90 0 0 1 708 382"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                    className="text-amber-700"
                />

                {/* Sixth square - right of fifth, curve going down */}
                <rect
                    x="708"
                    y="382"
                    width="56"
                    height="56"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    className="text-amber-900"
                />
                <path
                    d="M 708 382 A 56 56 0 0 1 764 438"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                    className="text-amber-700"
                />

                {/* Seventh square - bottom of sixth, curve going left */}
                <rect
                    x="708"
                    y="438"
                    width="34"
                    height="34"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="1"
                    className="text-amber-900"
                />
                <path
                    d="M 764 438 A 34 34 0 0 1 730 472"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    className="text-amber-700"
                />

                {/* Eighth square - left of seventh, curve going up */}
                <rect
                    x="708"
                    y="438"
                    width="21"
                    height="21"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="1"
                    className="text-amber-900"
                />
                <path
                    d="M 730 472 A 21 21 0 0 1 709 451"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    className="text-amber-700"
                />

                {/* Ninth square - top of eighth, curve going right */}
                <rect
                    x="708"
                    y="438"
                    width="13"
                    height="13"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="0.8"
                    className="text-amber-900"
                />
                <path
                    d="M 709 451 A 13 13 0 0 1 721 438"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="1.2"
                    className="text-amber-700"
                />
            </svg>
        </div>
    );
}