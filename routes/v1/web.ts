import BaseRoute from "../../base/ts/BaseRoute";
import express from 'express';
import ImageReequestController from "@root/app/basic/controllers/ImageRequestController";

export default class Web extends BaseRoute {
  baseRoute = ''
  onready(){
    let self = this;
    self.use('/',[],function(route : BaseRoute){
      route.get('','front.index',[],function(req : express.Request, res : express.Response){
        res.send('hello world!!!');
      });
    });
    self.use('/image-loader',[],function(route : BaseRoute){
      route.get('','front.image_loader',[],(new ImageReequestController()).index);
    });
  }
}