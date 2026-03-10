import { User } from '@/types/models/user';
import http from './config';
import { SendAuthEmailRequest, VerifyTokenRequest, VerifyTokenResponse } from '@/types/apis/auth';
import { GET_NEW_ACCESS_TOKEN_API_PATH } from '@/constants/auth';

export const authApi = {
  /** accessToken 재발급 */
  getNewAccessToken: () => http.post<VerifyTokenResponse>(GET_NEW_ACCESS_TOKEN_API_PATH, null, { withCredentials: true }),
  /** 로그인 또는 회원가입 이메일 전송  */
  sendAuthEmail: (request: SendAuthEmailRequest) => http.post("/auth/send-email", request),
  /** 매직링크 토큰 검증 */
  verifyToken: (request: VerifyTokenRequest) =>
    http.post<VerifyTokenResponse>("/auth/verify-token", request, { withCredentials: true }),
  /** 내정보 조회 */
  me: () => http.get<User>("/me")
}