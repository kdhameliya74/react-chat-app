export type userId = string | number;

export type User = {
  id?: userId;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  is_online?: boolean;
};
