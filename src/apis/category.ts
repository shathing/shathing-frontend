import http from "./config";
import { Category } from "@/types/models/category";

export const categoryApi = {
  /** 카테고리 리스트 조회 */
  getList: () => http.get<Category[]>("/categories"),
};
