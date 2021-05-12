import express from 'express';
import ImageLoaderService, { ImageLoaderServiceInterface } from "../services/ImageLoaderService";
import BaseController from './BaseController';

interface ImageRequestInterface extends BaseControllerInterface {
  returnImageLoaderService : {():ImageLoaderServiceInterface}
  index : Function
}

const ImageRequestController = BaseController.extend<ImageRequestInterface>({
  returnImageLoaderService(){
    return ImageLoaderService.create();
  },
  async index(req : express.Request ,res : express.Response){
    try{
      console.log('controller comming !');
      console.log('query',req.query);
      let props = this.getBaseQuery(req,{
        url : req.query.url || 'https://media.wired.com/photos/5a0201b14834c514857a7ed7/master/w_2560%2Cc_limit/1217-WI-APHIST-01.jpg',
        size : parseInt(req.query.size as any) || 500
      });
      let service = this.returnImageLoaderService();
      let resData1 = await service.createJobImageLoader(props);
      var waitingData = function(resData : string){
        return new Promise(function(resolve,reject){
          var unsubscribe : any = null;
          var test : string = null;
          var currentProcess = `test = function(err,props){
            try{
              if(err){
                throw err;
              }
              unsubscribe(function(){
                resolve({
                  data : props,
                  remove_listener : test
                });
              });
            }catch(ex){
              unsubscribe(function(){
                reject(ex);
              });
            }
          };`
          let r = Math.random().toString(36).substring(7);
          currentProcess = currentProcess.toString().replace('prefix',r);
          eval(currentProcess);
          unsubscribe = global.nrp.on(resData,test);
        })
      }
      let result : any = await waitingData(resData1);
      res.writeHead(200, { 'Content-Type': 'image/png' });
      result.data = Buffer.from(result.data, 'base64')
      res.end(result.data);
    }catch(ex){
      console.log(this);
      return this.returnSimpleError(ex,res);
    }
  }
});

export default ImageRequestController;