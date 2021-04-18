import BaseController from "../BaseController";
import express from 'express';

export interface ImageControllerInterface extends BaseControlerInterface{
  add ?: {(req : express.Request, res : express.Response) : Function}
}

export default BaseController.extend(<ImageControllerInterface>{
  add(req : express.Request, res : express.Response){
    let self = this;
    try{
      
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  }
});