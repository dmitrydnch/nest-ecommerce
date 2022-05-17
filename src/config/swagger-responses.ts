import { HttpStatus } from '@nestjs/common';

export const notfoundResponse = {
  description: 'Not found',
  content: {
    'application/json': {
      example: {
        result: false,
        error: {
          message: 'Not found',
          code: 1001,
        },
        data: {},
      },
    },
  },
};

export const unauthroziedResponse = {
  description: 'Unauthorized',
  content: {
    'application/json': {
      example: {
        result: false,
        error: {
          message: 'Unauthorized',
          code: 1008,
        },
        data: {},
      },
    },
  },
};

export const newTokensCreatedResponse = {
  status: HttpStatus.OK,
  description: '',
  content: {
    'application/json': {
      example: {
        result: true,
        error: {
          message: '',
          code: 0,
        },
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6...',
          refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQi...',
        },
      },
    },
  },
};
