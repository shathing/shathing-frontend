export interface SendAuthEmailRequest {
  email: string
}

export interface VerifyTokenRequest {
  token: string
}

export interface VerifyTokenResponse {
  accessToken: string
}