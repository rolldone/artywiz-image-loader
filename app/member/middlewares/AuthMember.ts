import {Request, Response} from 'express';

const AuthMemberMiddleware = function(req : Request,res : Response,next : Function){
  
  next();
}

export default AuthMemberMiddleware;