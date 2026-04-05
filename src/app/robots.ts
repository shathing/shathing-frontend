import type { MetadataRoute } from 'next'
import { host } from '@/config';
import { routing } from '@/i18n/routing';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      `${host}/sitemap.xml`,
      ...(routing.locales.map((lnag) => `${host}/sitemap/share/sitemap/${lnag}.xml`
      ))
    ]
  }
}