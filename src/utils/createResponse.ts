import { APIResponse } from '@fabiant1498/social-media-types';

const createResponse = <T>(
  success: boolean,
  data: T | null,
  error: { code: number; message: string } | null
) => {
  const response: APIResponse.ServerResponse<T> = {
    success,
    data,
    error,
  };

  return response;
};

export { createResponse };
