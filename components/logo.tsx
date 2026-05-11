import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link className="flex items-center gap-2" href="/" aria-label="D2 Studio">
      <Image
        src="/d2-light.svg"
        alt="D2 Studio"
        width={117}
        height={30}
        priority
        className="h-[30px] w-auto block dark:hidden"
      />
      <Image
        src="/d2-dark.svg"
        alt="D2 Studio"
        width={117}
        height={30}
        priority
        className="h-[30px] w-auto hidden dark:block"
      />
    </Link>
  );
};

export default Logo;
