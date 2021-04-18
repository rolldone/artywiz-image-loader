import BaseRoute, { BaseRouteInterface } from "../../base/ts/BaseRoute";
import ImageReequestController from "@root/app/basic/controllers/ImageRequestController";

export default BaseRoute.extend({
  baseRoute : '',
  onready(){
    let self = this;
    /* self.use('/',[],function(route : BaseRoute){
      route.get('','front.index',[],function(req : express.Request, res : express.Response){
        res.send('hello world!!!');
      });
    }); */
    self.use('/image-loader',[],function(route : BaseRouteInterface){
      route.get('','front.image_loader',[],(ImageReequestController.create()).index);
    });
  }
} as BaseRouteInterface)