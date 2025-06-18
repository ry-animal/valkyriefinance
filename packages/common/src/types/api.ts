// API types will be defined here when needed
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};
