export interface SharePostRequest {
  title: string,
  content: string,
  photoUrls: string[],
  legalDongCode: string,
  categoryId: number,
}

export interface GetShareListRequest {
  categoryId?: string,
  legalDongCode?: string,
  page?: number,
  size?: number,
}
