import BaseMemberController, {BaseMemberControllerInterface} from "../BaseMemberController";
import {Request, Response} from 'express';

export interface ImageIOInterface extends BaseMemberControllerInterface{
  addImage : {(req : Request, res : Response) : void},
  updateImage : {(req : Request, res : Response) : void},
  deleteImage : {(req : Request, res : Response) : void},
  getImages : {(req : Request, res : Response) : void},
  getImage : {(req : Request, res : Response) : void}

}

const ImageIOController = BaseMemberController.extend<ImageIOInterface>({
  addImage : function(req : Request,res : Response){
    
  },
  updateImage : function(req : Request, res : Response){
    
  },
  deleteImage : function(req : Request, res : Response){

  },
  getImages : function(req : Request, res : Response){

  },
  getImage : function(req : Request, res : Response){
    
  }
});

export default ImageIOController;