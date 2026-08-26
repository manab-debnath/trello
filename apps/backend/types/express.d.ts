import { User, Session } from "db/client"

declare global {
  namespace Express {
    interface Request {
        user: User,
        session: Session
    }
  }
}

export {}
