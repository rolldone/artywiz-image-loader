import { AppConfig } from "@root/config";
import Helpers from "@root/tool/Helpers";
import ImageDownloadQueue from "../queue/ImageDownloadQueue";
import BaseService, { BasicBaseServiceInterface } from "./BasicBaseService";

export interface ImageDownloadServiceInterface extends BasicBaseServiceInterface {
  downloadImageQueue : {(props :  {
    url : string,
    sizes : string
  }) : Promise<object>}
}

const ImageDownLoadService : ImageDownloadServiceInterface = BaseService.extend(<ImageDownloadServiceInterface>{
  downloadImageQueue : async function(props){
    let validator = this.returnValidator(props,{
      url : 'required',
      sizes : 'required'
    });
    switch(await validator.check()){
      case validator.fails:
        throw global.CustomError('error.validation',JSON.stringify(validator.errors.all()));
    }
    let sizes = JSON.parse(props.sizes||'[]');
    let job_id : string = props.url + props.sizes;
    let key = Helpers.generatePersistentJobId(job_id);
    console.log('downloadImageQueue',key,props);
    ImageDownloadQueue.dispatch({
      url : props.url,
      sizes : sizes
    },function(props : any){
      console.log('(<BaseQueueInterface>ImageDownloadQueue).dispatch ',props);
    }).setJobId(key).setTimeout(3000);

    /* Create key for socket too */
    return {
      socket_url : AppConfig.ROOT_DOMAIN+'/socket',
      key : key
    }
  }
});

export default ImageDownLoadService;