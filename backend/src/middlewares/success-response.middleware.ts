import { Response } from "express";

interface SuccessResponseData {
  message?: string;
  data?: any;
  token?: string;
}

export class SuccessResponse {
  static send(
    res: Response,
    statusCode: number,
    payload: SuccessResponseData
  ): void {
    const response: any = {
      success: true,
    };

    if (payload.message) {
      response.message = payload.message;
    }

    if (payload.data !== undefined) {
      response.data = payload.data;
    }

    if (payload.token) {
      response.token = payload.token;
      // Também envia o token no header para facilitar integração
      res.setHeader("Authorization", `Bearer ${payload.token}`);
    }

    res.status(statusCode).json(response);
  }

  static ok(res: Response, data?: any, message?: string): void {
    this.send(res, 200, { message, data });
  }

  static created(res: Response, data?: any, message?: string): void {
    this.send(res, 201, { message, data });
  }

  static withToken(
    res: Response,
    token: string,
    message?: string,
    statusCode?: number
  ): void {
    this.send(res, statusCode ?? 200, { message, token });
  }
}
