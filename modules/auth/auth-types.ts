export type AuthPayload = {
  email: string
  password: string
}

export type AuthResponse = {personId: number; token: string}
export type AuthError = "InvalidCredentials"
