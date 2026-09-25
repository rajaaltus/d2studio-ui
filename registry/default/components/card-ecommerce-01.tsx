"use client"

import * as React from "react"
import { CheckIcon, HeartIcon, ShoppingBagIcon, StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/default/ui/card"

export type ProductVariant = {
  name: string
  /** Swatch fill: any CSS colour. */
  swatch: string
  image: string
}

export type Product = {
  name: string
  category: string
  price: number
  /** The pre-discount price. Omit when the product is not on sale. */
  compareAt?: number
  currency?: string
  rating: number
  reviews: number
  variants: ProductVariant[]
  /** Short flag over the image, such as "New". The sale badge is derived. */
  tag?: string
}

const SAMPLE: Product = {
  name: "Halo Studio Wireless",
  category: "Over-ear headphones",
  price: 249,
  compareAt: 299,
  rating: 4.8,
  reviews: 212,
  tag: "New",
  variants: [
    {
      name: "Midnight",
      swatch: "#1c1c1e",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80&auto=format&fit=crop",
    },
    {
      name: "Graphite",
      swatch: "#6b6b70",
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&q=80&auto=format&fit=crop",
    },
  ],
}

// Every state change in the card shares one quick in-out curve, so the heart,
// the label and the photo read as one system rather than three effects.
const SWAP = "duration-200 ease-in-out motion-reduce:transition-none"

/** Two icons in one grid cell; the inactive one blurs and shrinks away. */
function IconSwap({
  on,
  off,
  active,
}: {
  on: React.ReactNode
  off: React.ReactNode
  active: boolean
}) {
  const layer = cn(
    "[grid-area:1/1] transition-[opacity,filter,transform]",
    SWAP
  )
  const hidden = "scale-25 opacity-0 blur-[2px]"
  return (
    <span className="inline-grid place-items-center" aria-hidden>
      <span className={cn(layer, active && hidden)}>{off}</span>
      <span className={cn(layer, !active && hidden)}>{on}</span>
    </span>
  )
}

/**
 * Text that swaps in place: the old line exits up with a blur, the new one
 * enters from below. The reflow between the two phases is what makes the entry
 * transition run instead of snapping.
 */
function SwapText({ children }: { children: string }) {
  const [shown, setShown] = React.useState(children)
  const [phase, setPhase] = React.useState<"idle" | "exit" | "enter">("idle")
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (children === shown) return
    setPhase("exit")
    const t = setTimeout(() => {
      setShown(children)
      setPhase("enter")
    }, 150)
    return () => clearTimeout(t)
  }, [children, shown])

  React.useLayoutEffect(() => {
    if (phase !== "enter") return
    void ref.current?.offsetHeight
    setPhase("idle")
  }, [phase])

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block transition-[transform,filter,opacity] duration-150 ease-in-out motion-reduce:transition-none",
        phase === "exit" && "-translate-y-1 opacity-0 blur-[2px]",
        phase === "enter" && "translate-y-1 opacity-0 blur-[2px] transition-none"
      )}
    >
      {shown}
    </span>
  )
}

export function ProductCard({
  product = SAMPLE,
  onAddToCart,
  onWishlistChange,
  className,
}: {
  product?: Product
  onAddToCart?: (product: Product, variant: ProductVariant) => void
  onWishlistChange?: (saved: boolean) => void
  className?: string
}) {
  const [variantIndex, setVariantIndex] = React.useState(0)
  const [saved, setSaved] = React.useState(false)
  const [added, setAdded] = React.useState(false)
  const addedTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(addedTimer.current), [])

  const variant = product.variants[variantIndex]
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency ?? "USD",
    maximumFractionDigits: 0,
  })
  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0

  function toggleSaved() {
    setSaved(!saved)
    onWishlistChange?.(!saved)
  }

  function addToCart() {
    onAddToCart?.(product, variant)
    setAdded(true)
    clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Card
      className={cn(
        "group/product w-full max-w-xs gap-0 overflow-hidden py-0",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {product.variants.map((v, i) => (
          // Every variant stays mounted so switching is a cross-fade, not a load.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={v.name}
            src={v.image}
            alt={i === variantIndex ? `${product.name} in ${v.name}` : ""}
            aria-hidden={i !== variantIndex}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn(
              "absolute inset-0 size-full object-cover",
              "transition-[opacity,filter,scale] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
              "group-hover/product:scale-[1.03]",
              i === variantIndex ? "opacity-100" : "opacity-0 blur-sm"
            )}
          />
        ))}

        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.tag && (
            <Badge className="bg-background/85 text-foreground backdrop-blur">
              {product.tag}
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="tabular-nums">−{discount}%</Badge>
          )}
        </div>

        <Button
          size="icon"
          variant="secondary"
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          onClick={toggleSaved}
          className="absolute top-3 right-3 size-9 rounded-full bg-background/85 backdrop-blur transition-transform duration-150 ease-out active:scale-[0.94]"
        >
          <IconSwap
            active={saved}
            off={<HeartIcon className="size-4" />}
            on={<HeartIcon className="size-4 fill-rose-500 text-rose-500" />}
          />
        </Button>
      </div>

      <CardContent className="flex flex-col gap-3 px-5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <h3 className="truncate font-medium leading-snug">{product.name}</h3>
          </div>
          <p className="flex shrink-0 items-center gap-1 pt-4 text-xs text-muted-foreground tabular-nums">
            <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">
              {product.rating.toFixed(1)}
            </span>
            <span>({product.reviews})</span>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="flex items-baseline gap-2 tabular-nums">
            <span className="text-lg font-semibold">{money.format(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-muted-foreground line-through">
                {money.format(product.compareAt)}
              </span>
            )}
          </p>

          {product.variants.length > 1 && (
            <div
              role="radiogroup"
              aria-label="Colour"
              className="flex items-center gap-2"
            >
              <span className="text-xs text-muted-foreground">
                <SwapText>{variant.name}</SwapText>
              </span>
              {product.variants.map((v, i) => (
                <button
                  key={v.name}
                  type="button"
                  role="radio"
                  aria-checked={i === variantIndex}
                  aria-label={v.name}
                  onClick={() => setVariantIndex(i)}
                  style={{ backgroundColor: v.swatch }}
                  className={cn(
                    "size-5 rounded-full ring-1 ring-foreground/10 ring-inset outline-offset-2 transition-[outline-color,transform] duration-150 ease-out active:scale-90",
                    "outline-2 outline-transparent focus-visible:outline-ring",
                    i === variantIndex && "outline-foreground"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-5 pt-4 pb-5">
        <Button
          className="w-full transition-transform duration-150 ease-out active:scale-[0.97]"
          onClick={addToCart}
          aria-live="polite"
        >
          <IconSwap
            active={added}
            off={<ShoppingBagIcon className="size-4" />}
            on={<CheckIcon className="size-4" />}
          />
          <SwapText>{added ? "Added to bag" : "Add to bag"}</SwapText>
        </Button>
      </CardFooter>
    </Card>
  )
}
