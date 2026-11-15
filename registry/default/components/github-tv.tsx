// GitHub TV — the chip on its own, unframed: no card, no section, so it stands
// on whatever surface it is dropped onto.

import GithubCard from "./github-tv/github-card";
import "./github-tv/github-tv.css";

export default function GithubTv({
  href = "https://github.com/",
  label = "Github",
  className = "",
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    // No frame and no section: the chip is the whole component, so it takes the
    // size and the surface of whatever it is dropped into.
    <div className={`flex items-center justify-center ${className}`}>
      <GithubCard href={href} label={label} />
    </div>
  );
}
