import { Controller, Get, HttpStatus, Inject, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseBuilder } from './responseBuilder/responseBuilder';
import { ResponseBuilderService } from './responseBuilder/responseBuilder.service';
import { Logger } from 'winston';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    readonly responseBuilderService: ResponseBuilderService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @ApiOperation({ summary: 'Fetch home page welcome message' })
  @ApiResponse({
    status: 200,
    description: 'Home page welcome message',
    type: ResponseBuilder,
  })
  @Get()
  async getHomePage(
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const data = await this.appService.getHomePageWelcome();
    const response = this.responseBuilderService.sendSuccess(data);
    return res.status(HttpStatus.OK).json(response);
  }
}
