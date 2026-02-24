export type BaseEntity = {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiError = {
  message: string;
  status: number;
};
