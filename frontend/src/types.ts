export type Post = {
  id: number;
  title: string;
  description: string;
  price: number;
  lat: number;
  lng: number;
};
export interface User {
  id: number;
  email: string;
  password?: string;
  created_at?: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}