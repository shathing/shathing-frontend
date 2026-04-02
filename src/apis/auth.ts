import { Member } from '@/types/models/member';
import http from './config';
import { SendAuthEmailRequest, VerifyTokenRequest } from '@/types/apis/auth';

export const authApi = {
  /** 로그인 또는 회원가입 이메일 전송  */
  sendAuthEmail: (request: SendAuthEmailRequest) => http.post("/auth/send-email", request),
  /** 매직링크 토큰 검증 */
  verifyToken: (request: VerifyTokenRequest) => http.post("/auth/verify-token", request),
  /** 로그아웃 */
  logout: () => http.post("/auth/logout"),
  /** 내정보 조회 */
  me: () => http.get<Member>("/me")
}