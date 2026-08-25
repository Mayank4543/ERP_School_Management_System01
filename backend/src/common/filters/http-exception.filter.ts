import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const responseBody =
      typeof exceptionResponse === 'string'
        ? {
          message: exceptionResponse,
        }
        : exceptionResponse as Record<string, any>;

    const errorResponse: ApiResponse = {
      success: false,

      error: {
        code:
          responseBody.code ||
          `ERROR_${status}`,

        message:
          responseBody.message ||
          'An error occurred',

        details: responseBody.details,

        // Important: preserve validation errors
        errors: responseBody.errors,
      },

      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    const responseBody =
      typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
        ? exceptionResponse as Record<string, any>
        : null;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : responseBody?.message ||
        (exception instanceof Error
          ? exception.message
          : 'Internal server error');

    const errorResponse: ApiResponse = {
      success: false,

      error: {
        code:
          responseBody?.code ||
          `ERROR_${status}`,

        message,

        details:
          responseBody?.details ||
          (exception instanceof Error
            ? exception.stack
            : undefined),

        errors: responseBody?.errors,
      },

      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}