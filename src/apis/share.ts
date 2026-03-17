import { SharePostRequest } from "@/types/apis/share";
import http from "./config";

export const shareApi = {
  /** 글쓰기 */
  post: (request: SharePostRequest) => http.post("/share/post", request),
}