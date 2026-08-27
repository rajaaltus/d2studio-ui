import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link className="flex items-center" href="/" aria-label="D2 Studio">
      <Image
        src="/d2-wordmark-light.svg"
        alt="D2 Studio"
        width={95}
        height={15}
        priority
        className="h-[15px] w-auto block dark:hidden"
      />
      <Image
        src="/d2-wordmark-dark.svg"
        alt="D2 Studio"
        width={95}
        height={15}
        priority
        className="h-[15px] w-auto hidden dark:block"
      />
    </Link>
  );
};

export default Logo;
