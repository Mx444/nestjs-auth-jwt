/** @format */

export interface JwtPayload {
  id: number;
  email: string;
}

export interface JwtRefreshPayload extends Omit<JwtPayload, 'email'> {
  type?: string;
}
