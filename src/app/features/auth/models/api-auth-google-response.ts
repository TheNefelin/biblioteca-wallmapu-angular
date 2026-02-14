import { User } from "./user";

export interface ApiAuthGoogleResponse {
  token: string,
  user: User
}
