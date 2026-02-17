import { IPayload } from "../interfaces/jwt.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IPayload
    }
  }
}