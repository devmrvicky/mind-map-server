export type SuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T | null;
};

export class SuccessHandler {
  create<T = unknown>(
    message: string,
    data: T | null = null
  ): SuccessResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }
}

export const successHandler = new SuccessHandler();
