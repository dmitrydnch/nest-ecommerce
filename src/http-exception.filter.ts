import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Logger } from 'winston';
import { ResponseBuilderService } from './responseBuilder/responseBuilder.service';
import { errorsList } from './config/errorsList';
import { ValidationException } from './pipes/exceptions/validation.exception';
import { Prisma } from '@prisma/client';
const {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
} = Prisma;

export const getStatusFromErrorCode = (code) => {
  return errorsList[`error${code}`].status;
};

export const formatCodeToErrorName = (code) => `error${code}`;

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
)
export class PrismaExceptionsFilter implements ExceptionFilter {
  private response;
  private request;
  private exception;

  constructor(
    readonly responseBuilderService: ResponseBuilderService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}
  public catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    this.response = ctx.getResponse();
    this.request = ctx.getRequest();
    this.exception = exception;

    if (exception instanceof PrismaClientKnownRequestError) {
      return this.clientKnownRequestError();
    }
    if (exception instanceof PrismaClientUnknownRequestError) {
      return this.clientUnknownRequestError();
    }
    if (exception instanceof PrismaClientValidationError) {
      return this.clientValidationError();
    }
    if (exception instanceof PrismaClientInitializationError) {
      return this.clientInitializationError();
    }
    if (exception instanceof PrismaClientRustPanicError) {
      return this.clientRustPanicError();
    }
  }

  private clientKnownRequestError(): any {
    switch (this.exception.code) {
      case 'P2002':
        const targets = this.exception.meta.target.join(', ');
        const message = errorsList.error1008.message + targets;
        this.responseMessage(message, 1008);
        break;
      default:
        this.responseMessage(errorsList.error1009.message, 1009);
        break;
    }
  }

  private clientUnknownRequestError(): any {
    switch (this.exception.code) {
      default:
        this.responseMessage(errorsList.error1010.message, 1010);
        break;
    }
  }

  private clientValidationError(): any {
    switch (this.exception.code) {
      default:
        this.responseMessage(errorsList.error1013.message, 1013);
        break;
    }
  }

  private clientRustPanicError(): any {
    switch (this.exception.code) {
      default:
        this.responseMessage(errorsList.error1014.message, 1014);
        break;
    }
  }

  private clientInitializationError(): any {
    switch (this.exception.code) {
      default:
        this.responseMessage(errorsList.error1012.message, 1012);
        break;
    }
  }

  private responseMessage(message, code) {
    const statusCode = getStatusFromErrorCode(code);
    const responseBuilder = this.responseBuilderService.sendError(
      message,
      code,
    );
    this.logger.error({
      statusCode,
      path: this.request.url,
      errorType: this.exception.name,
      errorMessage: this.exception.message,
    });
    this.response.status(statusCode).json(responseBuilder);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    readonly responseBuilderService: ResponseBuilderService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : !!errorsList[formatCodeToErrorName((exception as Error)?.message)]
        ? getStatusFromErrorCode((exception as Error)?.message)
        : HttpStatus.INTERNAL_SERVER_ERROR;

    /**
     * @description Exception json response
     * @param message
     */
    const responseMessage = async (type, message) => {
      let responseBuilder;
      if (!!errorsList[formatCodeToErrorName(message)]) {
        responseBuilder = this.responseBuilderService.sendError(
          errorsList[formatCodeToErrorName(message)].message,
          errorsList[formatCodeToErrorName(message)].code,
        );
      } else if (type === 'Validation Error' && Array.isArray(message)) {
        responseBuilder = this.responseBuilderService.sendError(
          `${errorsList.error1000}${message.join(' ')}`,
          errorsList.error1000.code,
        );
      } else if (message === 'Unauthorized') {
        responseBuilder = this.responseBuilderService.sendError(
          errorsList.error1007.message,
          errorsList.error1007.code,
        );
      } else if (message === "Cannot read property 'buffer' of undefined") {
        status = 400;
        responseBuilder = this.responseBuilderService.sendError(
          errorsList.error1006.message,
          errorsList.error1006.code,
        );
      } else {
        responseBuilder = this.responseBuilderService.sendError(
          errorsList.error1000.message + message,
          errorsList.error1000.code,
        );
      }
      this.logger.error({
        statusCode: status,
        path: request.url,
        errorType: type,
        errorMessage: message,
      });
      response.status(status).json(responseBuilder);
    };

    // Throw an exceptions for either
    // ValidationError, TypeError, CastError and Error
    if (exception instanceof ValidationException) {
      responseMessage(exception.message, exception.messages);
    } else if (!exception.name && exception.message) {
      if (exception.message.includes('Request failed with status code')) {
        status = +exception.message.slice(32);
        responseMessage('External request failed', exception.message);
      } else {
        responseMessage('Error', exception.message);
      }
    } else {
      responseMessage(exception.name, exception.message);
    }
  }
}
