import { SharePostRequest, GetShareItemsRequest } from "@/types/apis/share";
import http from "./config";
import { PageResponse } from "@/types/apis/common";
import { ShareItem } from "@/types/models/share-item";

export const shareApi = {
  /** 글쓰기 */
  post: (request: SharePostRequest) => http.post("/share/post", request),

  /** 공유글 리스트 가져오기 */
  getList: (request?: GetShareItemsRequest) => http.get<PageResponse<ShareItem>>("/share/posts", { params: request }),

  /** 공유글 상세페이지 정보 가져오기 */
  getById: (id: number) => http.get<ShareItem>(`/share/posts/${id}`),
}
