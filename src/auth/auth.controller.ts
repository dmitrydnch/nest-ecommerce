import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';
import { ResponseBuilderService } from '../responseBuilder/responseBuilder.service';
import { UsersService } from '../users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseBuilderService: ResponseBuilderService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Email and password login user' })
  @ApiResponse({
    status: 200,
    description: 'New tokens successfully created.',
    content: {
      'application/json': {
        example: {
          result: true,
          error: {
            message: '',
            code: 0,
          },
          data: {
            access_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjUyNzQ1NjE2LCJleHAiOjE2NTI3NDYyMTZ9.3Lx9D-esVNV7JbhOTGWFOMbIHDUNuQunaepotFcnkOM',
            refresh_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTI3NDU2MTYsImV4cCI6MTY1MzM1MDQxNn0.9vGFDWczHZLVHwrmjW4gr9VTUT9BFLXtqstuh8EWbd4',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
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
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiBearerAuth()
  @Post('refresh')
  public async refresh(
    @Request() req,
    @Res() res,
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<any> {
    try {
      const userUpdated = await this.authService.refreshToken(
        req,
        refreshTokenDto,
      );
      const responseBody = this.responseBuilderService.sendSuccess(userUpdated);
      return res.status(HttpStatus.OK).json(responseBody);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
