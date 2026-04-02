export interface SharePostRequest {
  title: string,
  content: string,
  photoUrls: string[],
  regionId: number,
  categoryId: number,
}

export interface UpdateShareItemRequest {
  title: string,
  content: string,
  photoUrls: string[],
  regionId: number,
  categoryId: number,
}

export interface GetShareItemsRequest {
  categoryId?: string,
  regionId?: string,
  search?: string,
  page?: number,
  size?: number,
}
