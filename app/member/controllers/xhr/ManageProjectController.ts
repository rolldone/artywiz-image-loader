import BaseMemberController, { BaseMemberControllerInterface } from "../BaseMemberController";
import {Request, Response} from 'express';

export interface ManageProjectControllerInterface extends BaseMemberControllerInterface{
  addProject : {(req: Request,res : Response):void}
  updateProject : {(req: Request,res : Response):void}
  deleteProject : {(req: Request,res : Response):void}
  getProjects : {(req: Request,res : Response):void}
  getProject : {(req: Request,res : Response):void}
}

const ManageProjectController = BaseMemberController.extend<ManageProjectControllerInterface>({
  addProject : function(req : Request, res : Response){

  },
  updateProject : function(req : Request, res : Response){

  },
  deleteProject : function(req : Request, res : Response){

  },
  getProjects : function(req : Request, res : Response){

  },
  getProject : function(req : Request, res : Response){
    
  },
});

export default ManageProjectController;