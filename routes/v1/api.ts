import BaseRoute, { BaseRouteInterface } from "../../base/BaseRoute";
import ImageController from "@root/app/basic/controllers/xhr/ImageController";

export default BaseRoute.extend({
  baseRoute: '/api/v1',
  onready() : void {
    let self = this;
    self.use('/basic',[],function(route : BaseRouteInterface){
      route.post('/image/add','basic.image.add',[],(ImageController.create()).add);
    });
  }
});