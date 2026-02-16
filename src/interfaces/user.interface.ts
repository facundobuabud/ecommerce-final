export type userRole = "USER" | "ADMIN"

export interface IUser {
  name: string,
  email: string,
  password: string,
  role: userRole,
  isActive: boolean
}