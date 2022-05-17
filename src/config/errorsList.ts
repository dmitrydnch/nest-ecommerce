import { HttpStatus } from '@nestjs/common';

export const errorsList = {
  error1000: {
    message: 'The next error was caught: ',
    code: 1000,
    status: HttpStatus.BAD_REQUEST,
  },
  error1001: {
    message: 'Not found',
    code: 1001,
    status: HttpStatus.BAD_REQUEST,
  },
  error1002: {
    message: 'Prisma error',
    code: 1002,
    status: HttpStatus.BAD_GATEWAY,
  },
  error1006: {
    message: 'Bad Request',
    code: 1011,
    status: HttpStatus.BAD_REQUEST,
  },
  error1007: {
    message: 'Unauthorized',
    code: 1008,
    status: HttpStatus.UNAUTHORIZED,
  },
  error1008: {
    message: 'User with this email already exists',
    code: 1009,
    status: HttpStatus.CONFLICT,
  },
};
