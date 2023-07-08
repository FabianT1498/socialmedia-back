import { APIResponse } from '@fabiant1498/llovizna-blog';

const createResponse = <T>(
  success: boolean,
  data: T | null,
  error: { code: number; message: string | Array<string> } | null
): APIResponse.ServerResponse<T> => {
  const response: APIResponse.ServerResponse<T> = {
    success,
    data,
    error,
  };

  return response;
};

export { createResponse };
