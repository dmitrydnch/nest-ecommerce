import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { configuration } from '../config/configuration';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject('winston')
    private readonly logger: Logger,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    let origin = req.header('Origin');
    if (!origin)
      origin = `http://${configuration.server.host}:${configuration.server.port}`;
    this.logger.info(
      `path: ${req.path}, method: ${req.method}, origin: ${origin}`,
    );
    next();
  }
}
