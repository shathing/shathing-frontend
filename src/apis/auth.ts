import http from './config';
import { SendAuthEmailRequest } from '@/types/apis/auth';

export const authApi = {
  /** 로그인 또는 회원가입 이메일 전송  */
  sendAuthEmail: (request: SendAuthEmailRequest) => http.post("/auth/send-email", request),
}