import { MetadataRoute } from 'next';
import { Locale } from 'next-intl';
import { host } from '@/config';
import { routing } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  return [getEntries('/')];
}

type Href = Parameters<typeof getPathname>[0]['href'];

function getEntries(href: Href) {
  return {
    url: getUrl(href),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)])
      ),
    },
  };
}

function getUrl(href: Href, locale?: Locale) {
  if (!locale) return host + '/' + routing.defaultLocale + href;

  const pathname = getPathname({ locale, href });
  return host + pathname;
}
