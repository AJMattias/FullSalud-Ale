import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorManager extends HttpException {
  constructor(message: string, status: number) {
    super(message, status);
  }

  public static createSignatureError(message: string) {
    const status = message.split(' :: ')[0];
    if (status) {
      throw new HttpException(message, parseInt(status));
    } else {
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
