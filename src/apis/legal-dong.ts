import http from "./config";
import { Location } from "@/types/models/location";

export const legalDongApi = {
  /** 법정동 리스트 조회 */
  getList: (code?: string) => http.get<Location[]>(`/legal-dongs?${code ? `code=${code}` : ""}`),
};
