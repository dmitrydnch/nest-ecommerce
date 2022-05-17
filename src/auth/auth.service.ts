import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { configuration } from '../config/configuration';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => PrismaService))
    private prisma: PrismaService,
  ) {}

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) return null;
    const compareResult = await bcrypt.compare(password, user.password);
    if (!compareResult) return null;
    return user;
  }

  public login(user: any) {
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public getRefreshToken(userId: number): string {
    const payload = { id: userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: configuration.jwt.jwtRefreshSecret,
      expiresIn: '7d',
    });
    return refreshToken;
  }

  public async addRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<any> {
    const decodedToken = this.jwtService.decode(refreshToken);
    const exp_at = decodedToken['exp'];
    return this.prisma.refreshTokens.create({
      data: { userId, token: refreshToken, exp_at },
    });
  }

  public async refreshToken(req, refreshTokenDto: RefreshTokenDto) {
    const header = req.headers.authorization;
    if (!refreshTokenDto.refreshToken) {
      throw new Error('1009');
    }
    if (!header) throw new UnauthorizedException();

    const bearer = header.split(' ');
    const oldToken = bearer[1];
    const verifiedRefreshToken = this.jwtService.verify(
      refreshTokenDto.refreshToken,
      {
        secret: configuration.jwt.jwtRefreshSecret,
      },
    );
    if (!verifiedRefreshToken) throw new UnauthorizedException();
    const decodedToken = this.jwtService.decode(oldToken);
    const userId = decodedToken['id'];
    const user = await this.usersService.findByIdAndRefreshToken(
      userId,
      refreshTokenDto.refreshToken,
    );
    if (!user) throw new UnauthorizedException();

    const { access_token } = await this.login(user);
    const refresh_token = this.getRefreshToken(user.id);
    await this.addRefreshToken(user.id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }
}
