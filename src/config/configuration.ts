export enum environmentTypes {
  Production = 'production',
  Development = 'development',
  Test = 'test',
}

export const configuration = {
  server: {
    host: process.env.API_ADDRESS || 'localhost',
    port: parseInt(process.env.API_PORT, 10) || 4444,
    environment: process.env.NODE_ENV || environmentTypes.Development,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'localhost-secret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'localhost-secret',
  },
};
