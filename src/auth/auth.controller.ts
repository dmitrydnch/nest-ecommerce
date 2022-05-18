import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';
import { ResponseBuilderService } from '../responseBuilder/responseBuilder.service';
import { UsersService } from '../users/users.service';
import {
  newTokensCreatedResponse,
  unauthroziedResponse,
} from '../config/swagger-responses';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseBuilderService: ResponseBuilderService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Email and password login user' })
  @ApiResponse(newTokensCreatedResponse)
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Request() req,
    @Res() res,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    try {
      const { user } = req;
      const { access_token } = this.authService.login(user);
      const refresh_token = this.authService.getRefreshToken(user._id);
      await this.authService.addRefreshToken(user.id, refresh_token);
      const response = this.responseBuilderService.sendSuccess({
        access_token,
        refresh_token,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({
    status: 200,
    description: 'New token successfully refreshed.',
    content: newTokensCreatedResponse.content,
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        example: {
          result: false,
          error: {
            message: 'The next error was caught: RefreshToken required',
            code: 1000,
          },
          data: {},
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  public async refresh(
    @Request() req,
    @Res() res,
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<any> {
    try {
      if (!refreshTokenDto.refreshToken) {
        throw new BadRequestException('RefreshToken required');
      }
      const userUpdated = await this.authService.refreshToken(
        req,
        refreshTokenDto,
      );
      const responseBody = this.responseBuilderService.sendSuccess(userUpdated);
      return res.status(HttpStatus.OK).json(responseBody);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException();
      }
      console.log(err);
      throw err;
    }
  }
}
