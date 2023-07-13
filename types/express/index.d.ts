import { User } from '@fabiant1498/llovizna-blog';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
