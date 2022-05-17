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
  //Prisma ORM Errors
  error1008: {
    message: 'Unique constraint failed on the ',
    code: 1009,
    status: HttpStatus.CONFLICT,
  },
  error1009: {
    message: 'ClientKnownRequestError',
    code: 1009,
    status: HttpStatus.CONFLICT,
  },
  error1010: {
    message: 'ClientUnknownRequestError',
    code: 1010,
    status: HttpStatus.CONFLICT,
  },
  error1014: {
    message: 'ClientRustPanicError',
    code: 1014,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  error1012: {
    message: 'ClientInitializationError',
    code: 1012,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  error1013: {
    message: 'ClientValidationError',
    code: 1013,
    status: HttpStatus.CONFLICT,
  },
};
