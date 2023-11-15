declare namespace Express {
    interface Request {
      token?: {
        _id: string; 
        role: string; 
        email:string;
      };
    }
  }