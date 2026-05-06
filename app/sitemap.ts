import { MetadataRoute } from 'next'
import blocks from '@/content/blocks.json'

type Block = {
  name: string
  isActive?: boolean
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://d2studio.dev'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blocks`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/spinners`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  const blockRoutes: MetadataRoute.Sitemap = (blocks as Block[])
    .filter((block) => block.isActive !== false)
    .map((block) => ({
      url: `${baseUrl}/blocks/${block.name}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [...staticRoutes, ...blockRoutes]
}
