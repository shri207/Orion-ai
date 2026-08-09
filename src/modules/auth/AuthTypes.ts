export interface IAuthUser {
  id: string;
  email: string;
  role: 'candidate' | 'admin' | 'interviewer';
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface IJwtService {
  generateToken(user: IAuthUser): string;
  verifyToken(token: string): IJwtPayload;
}

export interface IPasswordService {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
}

export interface IAuthService {
  login(email: string, passwordPlain: string): Promise<IAuthTokens>;
  validateSession(token: string): IJwtPayload;
}
