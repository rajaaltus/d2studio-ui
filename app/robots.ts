import { MetadataRoute } from 'next'

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'CCBot',
  'Google-Extended',
  'PerplexityBot',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
  'FacebookBot',
  'Meta-ExternalAgent',
  'cohere-ai',
  'Diffbot',
  'ImagesiftBot',
  'Omgilibot',
  'YouBot',
  'AwarioRssBot',
  'AwarioSmartBot',
  'DataForSeoBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/.well-known/',
          '/login',
          '/preview/',
          '/test',
        ],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        disallow: '/',
      })),
    ],
    sitemap: 'https://d2studio.dev/sitemap.xml',
    host: 'https://d2studio.dev',
  }
}