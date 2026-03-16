import http from "./config";
import { LegalDong } from "@/types/models/legal-dong";

export const legalDongApi = {
  /** 법정동 리스트 조회 */
  getList: (code?: string) => http.get<LegalDong[]>(`/legal-dongs?${code ? `code=${code}` : ""}`),
};
