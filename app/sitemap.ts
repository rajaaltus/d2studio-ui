import { MetadataRoute } from 'next'
import { categories } from '@/config/components'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://d2studio.dev'

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/components`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/docs/getting-started`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/docs/installation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Category pages
  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(categories).map((category) => ({
    url: `${baseUrl}/components/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Component pages (individual components)
  const componentRoutes: MetadataRoute.Sitemap = []
  Object.entries(categories).forEach(([categoryKey, category]) => {
    category.components.forEach((component) => {
      componentRoutes.push({
        url: `${baseUrl}/components/${categoryKey}/${component}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })
    })
  })

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...componentRoutes,
  ]
}