import { shareApi } from '@/apis/share'
import { host } from '@/config'
import { routing } from '@/i18n/routing'
import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  return routing.locales.map((locale) => ({ id: locale }))
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap | undefined> {
  const id = await props.id
  const countryCode = id === "ko" ? "KR" : "US"
  try {
    const { data } = await shareApi.getList({ countryCode, page: 0, size: 50000 });
    return data.items.map(({ id: itemId }) => ({
      url: `${host}/${id}/share/${itemId}`,
    }))
  } catch { }
}
