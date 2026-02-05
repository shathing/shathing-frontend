import http from './config';
import { SignInRequest, SignInResponse } from '@/types/apis/auth';

export const authApi = {
  /** 로그인 */
  signIn: (request: SignInRequest) => http.post<SignInResponse>("/signin", request),
}