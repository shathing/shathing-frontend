import { User } from '@/types/models/user';
import http from './config';
import { SendAuthEmailRequest, VerifyTokenRequest, VerifyTokenResponse } from '@/types/apis/auth';

export const authApi = {
  /** 로그인 또는 회원가입 이메일 전송  */
  sendAuthEmail: (request: SendAuthEmailRequest) => http.post("/auth/send-email", request),
  /** 매직링크 토큰 검증 */
  verifyToken: (request: VerifyTokenRequest) =>
    http.post<VerifyTokenResponse>("/auth/verify-token", request, { withCredentials: true }),
  /** 내정보 조회 */
  me: () => http.get<User>("/me")
}