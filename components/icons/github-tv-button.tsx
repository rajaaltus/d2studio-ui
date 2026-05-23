"use client";

import * as React from "react";

type GithubTvButtonProps = {
  href?: string;
  className?: string;
  label?: string;
};

const ICON_PATH =
  "M28 10.5C21.37 10.5 16 15.87 16 22.5C16 27.81 19.435 32.295 24.205 33.885C24.805 33.99 25.03 33.63 25.03 33.315C25.03 33.03 25.015 32.085 25.015 31.08C22 31.635 21.22 30.345 20.98 29.67C20.845 29.325 20.26 28.26 19.75 27.975C19.33 27.75 18.73 27.195 19.735 27.18C20.68 27.165 21.355 28.05 21.58 28.41C22.66 30.225 24.385 29.715 25.075 29.4C25.18 28.62 25.495 28.095 25.84 27.795C23.17 27.495 20.38 26.46 20.38 21.87C20.38 20.565 20.845 19.485 21.61 18.645C21.49 18.345 21.07 17.115 21.73 15.465C21.73 15.465 22.735 15.15 25.03 16.695C25.99 16.425 27.01 16.29 28.03 16.29C29.05 16.29 30.07 16.425 31.03 16.695C33.325 15.135 34.33 15.465 34.33 15.465C34.99 17.115 34.57 18.345 34.45 18.645C35.215 19.485 35.68 20.55 35.68 21.87C35.68 26.475 32.875 27.495 30.205 27.795C30.64 28.17 31.015 28.89 31.015 30.015C31.015 31.62 31 32.91 31 33.315C31 33.63 31.225 34.005 31.825 33.885C34.2076 33.0814 36.278 31.5505 37.7446 29.508C39.2112 27.4656 40 25.0145 40 22.5C40 15.87 34.63 10.5 28 10.5Z";

const TEXT_PATH =
  "M52.8011 31.9545C52.108 31.9545 51.5114 31.8636 51.0114 31.6818C50.5152 31.5 50.1098 31.2595 49.7955 30.9602C49.4811 30.661 49.2462 30.3333 49.0909 29.9773L50.5511 29.375C50.6534 29.5417 50.7898 29.7178 50.9602 29.9034C51.1345 30.0928 51.3693 30.2538 51.6648 30.3864C51.964 30.5189 52.3485 30.5852 52.8182 30.5852C53.4621 30.5852 53.9943 30.428 54.4148 30.1136C54.8352 29.803 55.0455 29.3068 55.0455 28.625V26.9091H54.9375C54.8352 27.0947 54.6875 27.3011 54.4943 27.5284C54.3049 27.7557 54.0436 27.9527 53.7102 28.1193C53.3769 28.286 52.9432 28.3693 52.4091 28.3693C51.7197 28.3693 51.0985 28.2083 50.5455 27.8864C49.9962 27.5606 49.5606 27.0814 49.2386 26.4489C48.9205 25.8125 48.7614 25.0303 48.7614 24.1023C48.7614 23.1742 48.9186 22.3788 49.233 21.7159C49.5511 21.053 49.9867 20.5455 50.5398 20.1932C51.0928 19.8371 51.7197 19.6591 52.4205 19.6591C52.9621 19.6591 53.3996 19.75 53.733 19.9318C54.0663 20.1098 54.3258 20.3182 54.5114 20.5568C54.7008 20.7955 54.8466 21.0057 54.9489 21.1875H55.0739V19.7727H56.7386V28.6932C56.7386 29.4432 56.5644 30.0587 56.2159 30.5398C55.8674 31.0208 55.3958 31.3769 54.8011 31.608C54.2102 31.839 53.5436 31.9545 52.8011 31.9545ZM52.7841 26.9602C53.2727 26.9602 53.6856 26.8466 54.0227 26.6193C54.3636 26.3883 54.6212 26.0587 54.7955 25.6307C54.9735 25.1989 55.0625 24.6818 55.0625 24.0795C55.0625 23.4924 54.9754 22.9754 54.8011 22.5284C54.6269 22.0814 54.3712 21.733 54.0341 21.483C53.697 21.2292 53.2803 21.1023 52.7841 21.1023C52.2727 21.1023 51.8466 21.2348 51.5057 21.5C51.1648 21.7614 50.9072 22.1174 50.733 22.5682C50.5625 23.0189 50.4773 23.5227 50.4773 24.0795C50.4773 24.6515 50.5644 25.1534 50.7386 25.5852C50.9129 26.017 51.1705 26.3542 51.5114 26.5966C51.8561 26.839 52.2803 26.9602 52.7841 26.9602ZM58.377 28.5V19.7727H60.0759V28.5H58.377ZM59.235 18.4261C58.9395 18.4261 58.6858 18.3277 58.4736 18.1307C58.2653 17.9299 58.1611 17.6913 58.1611 17.4148C58.1611 17.1345 58.2653 16.8958 58.4736 16.6989C58.6858 16.4981 58.9395 16.3977 59.235 16.3977C59.5305 16.3977 59.7823 16.4981 59.9907 16.6989C60.2028 16.8958 60.3089 17.1345 60.3089 17.4148C60.3089 17.6913 60.2028 17.9299 59.9907 18.1307C59.7823 18.3277 59.5305 18.4261 59.235 18.4261ZM65.7953 19.7727V21.1364H61.0282V19.7727H65.7953ZM62.3066 17.6818H64.0055V25.9375C64.0055 26.267 64.0548 26.5152 64.1532 26.6818C64.2517 26.8447 64.3786 26.9564 64.5339 27.017C64.693 27.0739 64.8654 27.1023 65.051 27.1023C65.1873 27.1023 65.3066 27.0928 65.4089 27.0739C65.5112 27.0549 65.5907 27.0398 65.6476 27.0284L65.9544 28.4318C65.8559 28.4697 65.7157 28.5076 65.5339 28.5455C65.3521 28.5871 65.1248 28.6098 64.8521 28.6136C64.4051 28.6212 63.9885 28.5417 63.6021 28.375C63.2157 28.2083 62.9032 27.9508 62.6646 27.6023C62.426 27.2538 62.3066 26.8163 62.3066 26.2898V17.6818ZM68.9209 23.3182V28.5H67.222V16.8636H68.8982V21.1932H69.0061C69.2107 20.7235 69.5232 20.3504 69.9436 20.0739C70.3641 19.7973 70.9133 19.6591 71.5914 19.6591C72.1898 19.6591 72.7126 19.7822 73.1595 20.0284C73.6103 20.2746 73.9588 20.642 74.205 21.1307C74.455 21.6155 74.58 22.2216 74.58 22.9489V28.5H72.8811V23.1534C72.8811 22.5133 72.7164 22.017 72.3868 21.6648C72.0573 21.3087 71.5989 21.1307 71.0118 21.1307C70.6103 21.1307 70.2505 21.2159 69.9323 21.3864C69.6179 21.5568 69.3698 21.8068 69.188 22.1364C69.0099 22.4621 68.9209 22.8561 68.9209 23.3182ZM81.7355 24.8807V19.7727H83.44V28.5H81.7695V26.9886H81.6786C81.4779 27.4545 81.1559 27.8428 80.7127 28.1534C80.2733 28.4602 79.726 28.6136 79.0707 28.6136C78.5101 28.6136 78.0139 28.4905 77.582 28.2443C77.154 27.9943 76.8169 27.625 76.5707 27.1364C76.3283 26.6477 76.207 26.0436 76.207 25.3239V19.7727H77.9059V25.1193C77.9059 25.714 78.0707 26.1875 78.4002 26.5398C78.7298 26.892 79.1578 27.0682 79.6843 27.0682C80.0025 27.0682 80.3188 26.9886 80.6332 26.8295C80.9514 26.6705 81.2146 26.4299 81.423 26.108C81.6351 25.786 81.7392 25.3769 81.7355 24.8807ZM85.219 28.5V16.8636H86.9179V21.1875H87.0202C87.1187 21.0057 87.2607 20.7955 87.4463 20.5568C87.6319 20.3182 87.8895 20.1098 88.219 19.9318C88.5486 19.75 88.9842 19.6591 89.5259 19.6591C90.2304 19.6591 90.8592 19.8371 91.4122 20.1932C91.9652 20.5492 92.399 21.0625 92.7134 21.733C93.0315 22.4034 93.1906 23.2102 93.1906 24.1534C93.1906 25.0966 93.0334 25.9053 92.719 26.5795C92.4046 27.25 91.9728 27.767 91.4236 28.1307C90.8743 28.4905 90.2474 28.6705 89.5429 28.6705C89.0126 28.6705 88.5789 28.5814 88.2418 28.4034C87.9084 28.2254 87.6471 28.017 87.4577 27.7784C87.2683 27.5398 87.1224 27.3277 87.0202 27.142H86.8781V28.5H85.219ZM86.8838 24.1364C86.8838 24.75 86.9728 25.2879 87.1509 25.75C87.3289 26.2121 87.5865 26.5739 87.9236 26.8352C88.2607 27.0928 88.6736 27.2216 89.1622 27.2216C89.6698 27.2216 90.094 27.0871 90.4349 26.8182C90.7759 26.5455 91.0334 26.1761 91.2077 25.7102C91.3857 25.2443 91.4747 24.7197 91.4747 24.1364C91.4747 23.5606 91.3876 23.0436 91.2134 22.5852C91.0429 22.1269 90.7853 21.7652 90.4406 21.5C90.0997 21.2348 89.6736 21.1023 89.1622 21.1023C88.6698 21.1023 88.2531 21.2292 87.9122 21.483C87.5751 21.7367 87.3194 22.0909 87.1452 22.5455C86.9709 23 86.8838 23.5303 86.8838 24.1364Z";

export function GithubTvButton({
  href = "https://github.com/godwin159",
  className,
  label = "Open GitHub repository",
}: GithubTvButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={
        "group relative inline-flex select-none items-center justify-center rounded-[12px] transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent" +
        (className ? ` ${className}` : "")
      }
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[14px] bg-gradient-to-b from-white/10 via-fuchsia-300/10 to-cyan-300/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <svg
        width={110}
        height={45}
        viewBox="0 0 110 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-[filter] duration-300 group-hover:drop-shadow-[0_4px_14px_rgba(149,120,200,0.45)]"
      >
        <g filter="url(#gh_tv_inner_shadow)">
          <rect
            width={110}
            height={45}
            rx={12}
            fill="url(#gh_tv_body_gradient)"
            fillOpacity={0.2}
          />
          <rect
            x={0.5}
            y={0.5}
            width={109}
            height={44}
            rx={11.5}
            stroke="url(#gh_tv_outer_stroke)"
          />
          <rect
            x={4}
            y={4}
            width={102}
            height={37}
            rx={8}
            fill="url(#gh_tv_screen_gradient)"
            fillOpacity={0.5}
          />
          <g opacity={0.75} filter="url(#gh_tv_phosphor_glow)">
            <g clipPath="url(#gh_tv_icon_clip_glow)">
              <path d={ICON_PATH} fill="black" />
              <path d={ICON_PATH} fill="url(#gh_tv_icon_gradient_glow)" />
            </g>
            <path d={TEXT_PATH} fill="white" />
            <path d={TEXT_PATH} fill="url(#gh_tv_text_gradient_glow)" />
          </g>
          <g
            className="origin-center transition-transform duration-500 ease-out group-hover:scale-105"
          >
            <g clipPath="url(#gh_tv_icon_clip)">
              <path d={ICON_PATH} fill="black" />
              <path d={ICON_PATH} fill="url(#gh_tv_icon_gradient)" />
            </g>
            <path d={TEXT_PATH} fill="white" />
            <path d={TEXT_PATH} fill="url(#gh_tv_text_gradient)" />
          </g>
        </g>
        <defs>
          <filter
            id="gh_tv_inner_shadow"
            x={0}
            y={-2}
            width={111}
            height={47}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx={1} />
            <feGaussianBlur stdDeviation={2} />
            <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend in2="shape" result="inner1" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha2"
            />
            <feOffset dx={1} dy={-2} />
            <feGaussianBlur stdDeviation={1.65} />
            <feComposite in2="hardAlpha2" operator="arithmetic" k2={-1} k3={1} />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
            <feBlend in2="inner1" />
          </filter>
          <filter
            id="gh_tv_phosphor_glow"
            x={11}
            y={5.5}
            width={88}
            height={34}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation={2.5} />
          </filter>
          <linearGradient
            id="gh_tv_body_gradient"
            x1={55}
            y1={0}
            x2={55}
            y2={45}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DEDEDE" />
            <stop offset={0.5} stopColor="#5E517A" />
            <stop offset={1} stopColor="#9578C8" />
          </linearGradient>
          <linearGradient
            id="gh_tv_outer_stroke"
            x1={55}
            y1={0}
            x2={55}
            y2={45}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#959595" />
            <stop offset={0.5} stopColor="#9E9E9E" />
            <stop offset={1} stopColor="#313131" />
          </linearGradient>
          <linearGradient
            id="gh_tv_screen_gradient"
            x1={55}
            y1={4}
            x2={55}
            y2={46.5}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5B5B5B" />
            <stop offset={0.569024} stopColor="#5B5B5B" stopOpacity={0.5} />
            <stop offset={1} stopColor="#E2E2E2" stopOpacity={0.15} />
          </linearGradient>
          <linearGradient
            id="gh_tv_icon_gradient_glow"
            x1={16}
            y1={22.204}
            x2={40}
            y2={22.204}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFEECA" />
            <stop offset={0.379808} stopColor="#DBFFCB" />
            <stop offset={0.75} stopColor="#FFE3DB" />
            <stop offset={1} stopColor="#ABEDFF" />
          </linearGradient>
          <linearGradient
            id="gh_tv_text_gradient_glow"
            x1={48}
            y1={22.5}
            x2={94}
            y2={22.5}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFEECA" />
            <stop offset={1} stopColor="#ABEDFF" />
          </linearGradient>
          <linearGradient
            id="gh_tv_icon_gradient"
            x1={16}
            y1={22.204}
            x2={40}
            y2={22.204}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFEECA" />
            <stop offset={0.379808} stopColor="#DBFFCB" />
            <stop offset={0.75} stopColor="#FFE3DB" />
            <stop offset={1} stopColor="#ABEDFF" />
          </linearGradient>
          <linearGradient
            id="gh_tv_text_gradient"
            x1={48}
            y1={22.5}
            x2={94}
            y2={22.5}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFEECA" />
            <stop offset={1} stopColor="#ABEDFF" />
          </linearGradient>
          <clipPath id="gh_tv_icon_clip_glow">
            <rect width={24} height={24} fill="white" transform="translate(16 10.5)" />
          </clipPath>
          <clipPath id="gh_tv_icon_clip">
            <rect width={24} height={24} fill="white" transform="translate(16 10.5)" />
          </clipPath>
        </defs>
      </svg>
    </a>
  );
}
