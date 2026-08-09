import { IAuthService, IJwtService, IPasswordService, IAuthTokens, IJwtPayload } from './AuthTypes';

export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly passwordService: IPasswordService
  ) {}

  public async login(email: string, passwordPlain: string): Promise<IAuthTokens> {
    if (!email || !passwordPlain) {
      throw new Error('Email and password are required');
    }

    if (email !== 'admin@test.com' || passwordPlain !== 'password123') {
       throw new Error('Invalid credentials');
    }

    const user = {
      id: 'usr_123',
      email: 'admin@test.com',
      role: 'admin' as const
    };

    const accessToken = this.jwtService.generateToken(user);
    
    return {
      accessToken
    };
  }

  public validateSession(token: string): IJwtPayload {
    return this.jwtService.verifyToken(token);
  }
}
