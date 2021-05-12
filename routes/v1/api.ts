import BaseRoute from "../../base/BaseRoute";
import ImageController from "@root/app/basic/controllers/xhr/ImageController";
import ImageIOController from "@root/app/member/controllers/xhr/ImageIOController";

export default BaseRoute.extend({
  baseRoute: '/api/v1',
  onready() : void {
    let self = this;
    self.use('/basic',[],function(route : BaseRouteInterface){
      route.post('/image/request-scanning','basic.image.request_scanning',[],ImageController.binding().requestScanning);
      route.post('/image/add','basic.image.add',[],ImageController.binding().add);
    });
    self.use('/member',[],function(route : BaseRouteInterface){
      route.get('/imageio/images','member.imageio.images',[],ImageIOController.binding().getImages);
      route.get('/imageio/image/{id}/view','member.imageio.image',[],ImageIOController.binding().getImage);
      route.post('/imageio/add','member.imageio.add',[],ImageIOController.binding().addImage);
      route.post('/imageio/update','member.imageio.update',[],ImageIOController.binding().updateImage);
      route.post('/imageio/delete','member.imageio.delete',[],ImageIOController.binding().deleteImage);
    });
  }
});