"use client"

import { Card, CardContent } from "@/registry/default/ui/card"
import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/default/ui/avatar"
import { Calendar, Clock, User, MessageCircle, Share2, Bookmark } from "lucide-react"

export default function Component() {
  const articles = [
    {
      id: 1,
      title: "Building Modern React Applications with TypeScript",
      excerpt: "Learn how to leverage TypeScript's powerful type system to build more reliable and maintainable React applications.",
      author: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/32/32",
        role: "Senior Developer"
      },
      date: "Mar 15, 2024",
      readTime: "8 min read",
      tags: ["React", "TypeScript", "Development"],
      comments: 24,
      image: "/api/placeholder/400/200",
      featured: true
    },
    {
      id: 2,
      title: "The Future of Web Development: Trends to Watch",
      excerpt: "Explore the latest trends and technologies shaping the future of web development in 2024 and beyond.",
      author: {
        name: "Mike Chen",
        avatar: "/api/placeholder/32/32",
        role: "Tech Lead"
      },
      date: "Mar 12, 2024",
      readTime: "6 min read",
      tags: ["Web Dev", "Trends", "Future"],
      comments: 18,
      image: "/api/placeholder/400/200",
      featured: false
    },
    {
      id: 3,
      title: "Optimizing Performance in Next.js Applications",
      excerpt: "Discover best practices and techniques for improving the performance of your Next.js applications.",
      author: {
        name: "Emma Davis",
        avatar: "/api/placeholder/32/32",
        role: "Frontend Engineer"
      },
      date: "Mar 10, 2024",
      readTime: "10 min read",
      tags: ["Next.js", "Performance", "Optimization"],
      comments: 31,
      image: "/api/placeholder/400/200",
      featured: false
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {articles.map((article, index) => (
        <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className={`grid gap-0 ${index === 0 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
            {/* Article Image */}
            <div className={`relative ${index === 0 ? 'md:order-2' : ''}`}>
              <div className="aspect-video md:aspect-square bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Article Image</span>
                </div>
              </div>
              {article.featured && (
                <Badge className="absolute top-3 left-3">
                  Featured
                </Badge>
              )}
            </div>

            {/* Article Content */}
            <CardContent className={`p-6 ${index === 0 ? 'md:order-1 md:col-span-1' : 'md:col-span-2'}`}>
              <div className="space-y-4 h-full flex flex-col">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title & Excerpt */}
                <div className="space-y-2 flex-1">
                  <h2 className={`font-bold leading-tight hover:text-primary cursor-pointer ${
                    index === 0 ? 'text-xl md:text-2xl' : 'text-lg'
                  }`}>
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                {/* Author & Meta */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={article.author.avatar} alt={article.author.name} />
                      <AvatarFallback>
                        {article.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{article.author.name}</p>
                      <p className="text-xs text-muted-foreground">{article.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {article.comments}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Bookmark className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}