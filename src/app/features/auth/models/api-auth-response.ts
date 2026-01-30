import { User } from "@features/auth/models/user";

export interface ApiAuthResponse {
  token: string,            // JWT de TU backend
  user: User
}
