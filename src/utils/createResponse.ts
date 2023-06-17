import APIResponse from './typings/APIResponse.interface';

const createResponse = <T>(
  success: boolean,
  data: T | null,
  error: { code: number; message: string } | null
) => {
  const response: APIResponse<T> = {
    success,
    data,
    error,
  };

  return response;
};

export { createResponse };
