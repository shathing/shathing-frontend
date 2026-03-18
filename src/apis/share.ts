import { SharePostRequest, GetShareListRequest } from "@/types/apis/share";
import http from "./config";
import { PageResponse } from "@/types/apis/common";
import { ShareItem } from "@/types/models/share-item";

export const shareApi = {
  /** 글쓰기 */
  post: (request: SharePostRequest) => http.post("/share/post", request),

  getList: (params?: GetShareListRequest) => http.get<PageResponse<ShareItem>>("/share/posts", { params }),
}
