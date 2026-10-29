import { cn } from "@/lib/utils";

// The rig and the 20ft box, hanging still. Pure markup; crate.css places it.
export function Rig() {
  return (
    <>
      <span aria-hidden className="hc-crate-shadow absolute" />
      <div className="hc-rig absolute">
        <div aria-hidden className="hc-cables">
          {/* Twin hoist ropes over a block in hazard stripes, and a forged
              hook with a safety latch on a swivel eye. */}
          <span className="hc-ropes">
            <span className="hc-rope" />
            <span className="hc-rope" />
          </span>
          <span className="hc-hook-block">
            <span className="hc-block-face">
              <span className="hc-bolt hc-axle top-1/2 left-1/2 -mt-[3.5px] -ml-[3.5px]" />
            </span>
          </span>
          <svg className="hc-hook" viewBox="0 0 20 34" fill="none" strokeLinecap="round">
            <defs>
              <linearGradient id="hc-hook-steel" x1="0" x2="1" y1="0" y2="0.4">
                <stop offset="0" stopColor="oklch(0.55 0.004 250)" />
                <stop offset="0.45" stopColor="oklch(0.95 0.002 250)" />
                <stop offset="1" stopColor="oklch(0.5 0.004 250)" />
              </linearGradient>
            </defs>
            <g stroke="oklch(0.2 0.004 250)" strokeWidth="3.8">
              <circle cx="10" cy="3.5" r="2.4" />
              <path d="M10 6v7a5.5 5.5 0 1 1-5.5 5.5" />
              <ellipse cx="10" cy="27.5" rx="3" ry="4.4" />
            </g>
            <g stroke="url(#hc-hook-steel)" strokeWidth="2.2">
              <circle cx="10" cy="3.5" r="2.4" />
              <path d="M10 6v7a5.5 5.5 0 1 1-5.5 5.5" />
              <ellipse cx="10" cy="27.5" rx="3" ry="4.4" />
            </g>
            <path d="M4.6 18.2 9.6 13.4" stroke="oklch(0.78 0.003 250)" strokeWidth="1" />
          </svg>
        </div>
        <div className="hc-yaw">
          <div className="hc-squash">
            <Crate />
          </div>
        </div>
      </div>
    </>
  );
}

// Six outer faces and four slings to the hook.
function Crate() {
  return (
    <div aria-hidden className="hc-box">
      <span className="hc-face hc-side hc-f-front">
        <span className="hc-pocket left-[24%]" />
        <span className="hc-pocket right-[24%]" />
        <span className="hc-print">
          Container <span className="hc-print-box">D2</span>
        </span>
        <span className="hc-code hc-code-side">
          BRTU 202610 4<br />
          22G1
        </span>
        <Castings />
      </span>
      <span className="hc-face hc-side hc-f-back">
        <span className="hc-pocket left-[24%]" />
        <span className="hc-pocket right-[24%]" />
        <Castings />
      </span>
      <span className="hc-face hc-end hc-f-blank">
        <Castings />
      </span>
      <span className="hc-face hc-end hc-f-doors">
        <span className="hc-opening">
          <Leaf side="left" />
          <Leaf side="right" />
        </span>
        <Castings />
      </span>
      <span className="hc-face hc-roof hc-f-top" />
      <span className="hc-face hc-roof hc-f-bottom" />

      {[
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ].map(([x, z]) => (
        // Each leg: a pressed ferrule at both eyes, and a shackle into its
        // corner casting.
        <span key={`${x}${z}`} className="hc-sling" style={{ "--sx": x, "--sz": z } as React.CSSProperties}>
          <span className="hc-ferrule top-[9%]" />
          <span className="hc-ferrule bottom-[7%]" />
          <span className="hc-shackle" />
        </span>
      ))}
    </div>
  );
}

function Castings() {
  return (
    <>
      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((at) => (
        <span key={at} className={cn("hc-casting", at)} />
      ))}
    </>
  );
}

// A shut door leaf: two locking bars with cam keepers and a handle, hinges on
// the outer edge, the owner code on the right leaf and a plate on the left.
function Leaf({ side }: { side: "left" | "right" }) {
  return (
    <span className={cn("hc-leaf", side === "left" ? "left-0" : "right-0")}>
      <span className="hc-leaf-face">
        {[0.24, 0.7].map((at) => (
          <span key={at} className="hc-rod" style={{ left: `${(side === "left" ? at : 1 - at) * 100}%` }}>
            <span className="hc-keeper top-[-2px]" />
            <span className="hc-keeper bottom-[-2px]" />
            <span className={cn("hc-handle", side === "right" && "right-0")} />
          </span>
        ))}
        {side === "right" ? (
          <span className="hc-code">
            BRTU 202610 4<br />
            22G1
          </span>
        ) : (
          <span className="hc-plate" />
        )}
        {[0.08, 0.36, 0.64, 0.92].map((at) => (
          <span key={at} className={cn("hc-hinge", side === "left" ? "left-[-3px]" : "right-[-3px]")} style={{ top: `${at * 100}%` }} />
        ))}
      </span>
    </span>
  );
}
