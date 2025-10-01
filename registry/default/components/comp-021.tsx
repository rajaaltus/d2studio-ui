"use client"

import { useState } from "react"
import { Card, CardContent } from "@/registry/default/ui/card"
import { Input } from "@/registry/default/ui/input"
import { Button } from "@/registry/default/ui/button"
import { Badge } from "@/registry/default/ui/badge"
import { Search, Filter, X } from "lucide-react"

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const filters = [
    { id: "react", label: "React", count: 24 },
    { id: "typescript", label: "TypeScript", count: 18 },
    { id: "nextjs", label: "Next.js", count: 12 },
    { id: "tailwind", label: "Tailwind", count: 30 },
    { id: "components", label: "Components", count: 45 },
    { id: "forms", label: "Forms", count: 8 },
    { id: "navigation", label: "Navigation", count: 6 },
  ]

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  const clearFilters = () => {
    setSelectedFilters([])
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search components, tutorials, or documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Filter Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters</span>
                {selectedFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const isSelected = selectedFilters.includes(filter.id)
                  return (
                    <Button
                      key={filter.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter(filter.id)}
                      className="h-8 text-xs"
                    >
                      {filter.label}
                      <Badge
                        variant={isSelected ? "secondary" : "outline"}
                        className="ml-2 h-4 px-1 text-xs"
                      >
                        {filter.count}
                      </Badge>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Active Filters */}
            {selectedFilters.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.map((filterId) => {
                    const filter = filters.find(f => f.id === filterId)
                    return (
                      <Badge
                        key={filterId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {filter?.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFilter(filterId)}
                          className="h-3 w-3 p-0 hover:bg-transparent"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Search Results Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {searchQuery || selectedFilters.length > 0
                  ? `Showing filtered results`
                  : `Showing all results`}
              </span>
              <span>124 items found</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}