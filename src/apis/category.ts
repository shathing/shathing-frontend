import { CategoryRequest } from "@/types/apis/category";
import http from "./config";
import { Category } from "@/types/models/category";
import { CountryCode } from "@/types/apis/common";

export const categoryApi = {
  /** 카테고리 아이디로 카테고리 정보 조회 */
  getCategory: (request: CategoryRequest) => http.get<Category>("/category", { params: request }),

  /** 카테고리 리스트 조회 */
  getList: (countryCode: CountryCode) => http.get<Category[]>("/categories", { params: { countryCode } }),
};
