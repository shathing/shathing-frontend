import { shareApi } from '@/apis/share'
import { host } from '@/config'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap | undefined> {
  try {
    const { data } = await shareApi.getList()
    return data.items.map(({ id }) => ({
      url: `${host}/ko/share/${id}`,
    }))
  } catch { }
}