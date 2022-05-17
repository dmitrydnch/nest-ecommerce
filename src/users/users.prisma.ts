import { Prisma } from '@prisma/client';

export const userPublicFields: Prisma.UserSelect = {
  id: true,
  email: true,
  fullname: true,
  birth: true,
  verified: true,
};
