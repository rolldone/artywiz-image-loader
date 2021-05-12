import BaseMemberController, { BaseMemberControllerInterface } from "../BaseMemberController";
import {Request, Response} from 'express';

export interface AuthMemberControllerInterface extends BaseMemberControllerInterface{
  register: { (req: Request, res: Response): void }
  authBasic: { (req: Request, res: Response): void }
  authOAuth: { (req: Request, res: Response): void }
}

const AuthMemberController = BaseMemberController.extend<AuthMemberControllerInterface>({
  register: function(req : Request, res : Response){
    
  },
  authBasic: function(req : Request, res : Response){

  },
  authOAuth: function(req : Request, res : Response){

  },
});

export default AuthMemberController;