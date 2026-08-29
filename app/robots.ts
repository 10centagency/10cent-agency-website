import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth'],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'Claude-SearchBot',
          'Claude-User',
          'PerplexityBot',
          'Perplexity-User',
        ],
        allow: '/',
        disallow: ['/api/', '/admin/', '/auth'],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended'],
        disallow: '/',
      },
    ],
    sitemap: 'https://www.10centagency.com/sitemap.xml',
    host: 'https://www.10centagency.com',
  };
}
