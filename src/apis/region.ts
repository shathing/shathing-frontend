import { RegionRequest } from "@/types/apis/region";
import http from "./config";
import { Region } from "@/types/models/region";

export const regionApi = {
  /** 지역 조회 */
  getList: (request: RegionRequest) => http.get<Region[]>("/regions", { params: request }),
};
