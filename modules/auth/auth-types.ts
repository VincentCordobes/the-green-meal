export type AuthPayload = {
  username: string
  password: string
}

export type AuthResponse = {personId: number; token: string}
