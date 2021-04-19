import BaseController from "../BaseController";
import express from 'express';
import ImageDownLoadService, { ImageDownloadServiceInterface } from "../../services/ImageDownloadService";

interface ImageControllerInterface extends BaseControlerInterface{
  add ?: {(req : express.Request, res : express.Response) : Promise<any>}
  returnImageDownloadService : any 
}
interface resDataDownloadImageRequestInterface {
  url : string,
  key : string
}

const ImageController : ImageControllerInterface = BaseController.extend(<ImageControllerInterface>{
  returnImageDownloadService(){
    return ImageDownLoadService.create();
  },
  async add(req : express.Request, res : express.Response){
    let self = this;
    try{
      let props = req.body;
      let imageDownloadService : ImageDownloadServiceInterface = self.returnImageDownloadService();
      let resData = await imageDownloadService.downloadImageQueue({
        url : props.url,
        sizes : props.sizes
      }) as resDataDownloadImageRequestInterface;
      var waitingData = function(resData : resDataDownloadImageRequestInterface){
        return new Promise(function(resolve,reject){
          var total = 0;
          var unsubscribe : any = null;
          var test : string = null;
          var currentProcess = `test = function(err,props){
            try{
              // var deserializeError = global.deserializeError(props);
              // if(deserializeError.toString().match('NonError') == null){
              //   throw props;
              // }
              if(err){
                throw err;
              }
              if(props.length == props[0].total){
                console.log('currentProcess => done');
                unsubscribe(function(){
                  /* Message here */
                  resolve(resData);
                });
              }
            }catch(ex){
              unsubscribe(function(){
                console.error('nrp - message - error -> ',ex);
                reject(ex);
              });
            }
          };`
          let r = Math.random().toString(36).substring(7);
          currentProcess = currentProcess.toString().replace('prefix',r);
          eval(currentProcess);
          unsubscribe = global.nrp.on(resData.key,test);
        })
      }
      let result : any = await waitingData(resData);
      let response = {
        status : 'success',
        status_code : 200,
        return : resData
      }
      res.send(response).status(response.status_code);
      return;
    }catch(ex){
      return this.returnSimpleError(ex,res);
    }
  }
});

export default ImageController;