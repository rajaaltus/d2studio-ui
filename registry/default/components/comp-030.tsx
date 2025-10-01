"use client"

import { useState } from "react"
import { Card, CardContent } from "@/registry/default/ui/card"
import { Button } from "@/registry/default/ui/button"
import { Badge } from "@/registry/default/ui/badge"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"

export default function Component() {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const product = {
    name: "Premium Wireless Headphones",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviews: 2847,
    images: [
      "/api/placeholder/400/400",
      "/api/placeholder/400/400",
      "/api/placeholder/400/400",
    ],
    colors: ["Black", "White", "Silver"],
    sizes: ["Small", "Medium", "Large"],
    inStock: true,
    discount: 20,
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Product Image</span>
            </div>

            {/* Overlay Actions */}
            <div className="absolute top-3 right-3 space-y-2">
              <Button
                variant={isWishlisted ? "default" : "secondary"}
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted ? "fill-current" : ""
                  }`}
                />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 space-y-1">
              {product.discount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{product.discount}%
                </Badge>
              )}
              {product.inStock && (
                <Badge variant="secondary" className="text-xs">
                  In Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3">
            <Button
              className="w-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm line-clamp-2 leading-tight">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>

          {/* Color Options */}
          <div className="flex gap-1">
            {product.colors.map((color, index) => (
              <button
                key={color}
                className={`h-6 w-6 rounded-full border-2 ${
                  index === 0
                    ? "border-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  backgroundColor:
                    color === "Black"
                      ? "#000"
                      : color === "White"
                      ? "#fff"
                      : "#c0c0c0",
                }}
                title={color}
              />
            ))}
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full" size="sm">
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}