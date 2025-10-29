export interface LoginResponse {
  message: string;
  statusCode: number;
  accessToken: string;
  refreshToken: string;
}
