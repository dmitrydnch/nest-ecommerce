import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { ResponseBuilderService } from '../responseBuilder/responseBuilder.service';
import { RegistrationDto } from './dto/registration.dto';
import * as bcrypt from 'bcryptjs';
import { exclude } from '../prisma/prisma.functions';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  notfoundResponse,
  unauthroziedResponse,
} from '../config/swagger-responses';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseBuilderService: ResponseBuilderService,
  ) {}

  @ApiOperation({ summary: 'User registration endpoint' })
  @ApiResponse({
    status: 201,
    description: 'The new user has been successfully created.',
    content: {
      'application/json': {
        example: {
          result: true,
          error: {
            message: '',
            code: 0,
          },
          data: {
            id: 1,
            email: 'some.user@mail.com',
            birth: '06-01-1996',
            fullname: 'Tom Holland',
            verified: false,
          },
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'User with this email already exists',
    content: {
      'application/json': {
        example: {
          result: false,
          error: {
            message: 'Unique constraint failed on the email',
            code: 1008,
          },
          data: {},
        },
      },
    },
  })
  @Post('registration')
  public async registration(
    @Req() req: Request,
    @Res() res: Response,
    @Body() registrationDto: RegistrationDto,
  ): Promise<Response> {
    try {
      registrationDto.password = await bcrypt.hash(registrationDto.password, 8);
      const userObject = await this.usersService.create(registrationDto);
      const user = exclude(userObject, ['password', 'activationLink']);
      const responseBody = this.responseBuilderService.sendSuccess(user);
      return res.status(HttpStatus.CREATED).json(responseBody);
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Fetch all users router' })
  @ApiResponse({
    status: 200,
    description: 'Fetch all users',
    content: {
      'application/json': {
        example: {
          result: true,
          error: {
            message: '',
            code: 0,
          },
          data: [
            {
              id: 4,
              email: 'user@gmail.com',
              fullname: 'Tom Cruise',
              birth: '07-03-1962',
              verified: false,
            },
            {
              id: 5,
              email: 'some.user@mail.com',
              fullname: 'Tom Holland',
              birth: '06-01-1996',
              verified: false,
            },
          ],
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  public async all(@Res() res: Response): Promise<Response> {
    try {
      const users = await this.usersService.findAll();
      const responseBody = this.responseBuilderService.sendSuccess(users);
      return res.status(HttpStatus.OK).json(responseBody);
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get self profile' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    content: {
      'application/json': {
        example: {
          result: true,
          error: {
            message: '',
            code: 0,
          },
          data: [
            {
              id: 1,
              email: 'some.user@mail.com',
              fullname: 'Tom Holland',
              birth: '06-01-1996',
              verified: false,
            },
          ],
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  public async getMe(@Req() req: Request, @Res() res: Response) {
    try {
      const { user }: any = req;
      const responseBody = this.responseBuilderService.sendSuccess(
        exclude(user, ['password', 'activationLink']),
      );
      return res.status(HttpStatus.OK).json(responseBody);
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Verify user' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    content: {
      'application/json': {
        example: {
          result: true,
          error: {
            message: '',
            code: 0,
          },
          data: [
            {
              id: 1,
              email: 'some.user@mail.com',
              fullname: 'Tom Holland',
              birth: '06-01-1996',
              verified: false,
            },
          ],
        },
      },
    },
  })
  @ApiConflictResponse({ description: 'Activation link incorrect' })
  @ApiConflictResponse({ description: 'User already verefied' })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('verify/:activationLink')
  public async verify(
    @Req() req: Request,
    @Res() res: Response,
    @Param('activationLink') activationLink: string,
  ) {
    try {
      const { user }: any = req;
      if (user.verified) {
        throw new HttpException('User already verefied', 409);
      }
      if (activationLink !== user.activationLink) {
        throw new HttpException('Activation link incorrect', 409);
      }

      const updatedUser = await this.usersService.verify(user.id);
      const responseBody = this.responseBuilderService.sendSuccess(updatedUser);
      return res.status(HttpStatus.OK).json(responseBody);
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Update self profile' })
  @ApiResponse({
    status: 200,
    description: 'Updated',
    content: {
      'application/json': {
        example: {
          result: true,
          error: {
            message: '',
            code: 0,
          },
          data: {
            id: 1,
            email: 'some.user@mail.com',
            birth: '09-25-1968',
            fullname: 'Will Smith',
            verified: false,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Response> {
    try {
      const { user }: any = req;

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 8);
      }

      const updatedData = await this.usersService.update(
        user.id,
        updateUserDto,
      );

      const responseBody = this.responseBuilderService.sendSuccess(
        exclude(updatedData, ['password', 'activationLink']),
      );
      return res.status(HttpStatus.OK).json(responseBody);
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    content: {
      'application/json': {
        example: {
          result: true,
          error: {
            message: '',
            code: 0,
          },
          data: {
            id: 1,
            email: 'some.user@mail.com',
            birth: '06-01-1996',
            fullname: 'Tom Holland',
            verified: false,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(unauthroziedResponse)
  @ApiNotFoundResponse(notfoundResponse)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findOne(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<any | Response> {
    try {
      const user = await this.usersService.findById(+id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const responseBody = this.responseBuilderService.sendSuccess(
        exclude(user, ['password', 'activationLink']),
      );
      return res.status(HttpStatus.OK).json(responseBody);
    } catch (err) {
      console.log(`Error: ${err}`);
      throw err;
    }
  }
}
