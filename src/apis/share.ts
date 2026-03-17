import { SharePostRequest } from "@/types/apis/share";
import http from "./config";


export const shareApi = {
  post: (request: SharePostRequest) => http.post("/share/post", request)
}