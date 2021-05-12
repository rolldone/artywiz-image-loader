import BaseRoute from "../../base/BaseRoute";
import ImageRequestController from "@root/app/basic/controllers/ImageRequestController";

export default BaseRoute.extend({
  baseRoute : '',
  onready(){
    let self = this;
    self.use('/image-loader',[],function(route : BaseRouteInterface){
      route.get('','front.image_loader',[],ImageRequestController.binding().index);
    });
  }
} as BaseRouteInterface)