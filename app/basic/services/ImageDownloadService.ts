import { AppConfig } from "@root/config";
import ImageDownloadQueue from "../queue/ImageDownloadQueue";
import BaseService from "./BaseService";

interface ImageDownloadServiceInterface extends BaseServiceInterface {
  downloadImageQueue : {(props : object) : void}
}

export default BaseService.extend(<ImageDownloadServiceInterface>{
  downloadImageQueue : async function(props : any){
    let validator = this.returnValidator(props,{});
    switch(await validator.check()){
      case validator.fails:
        throw global.CustomError('error.validation',JSON.stringify(validator.errors.all()));
    }
    let sizes = JSON.parse(props.sizes||'[]');
    let job_id : string = props.url + props.sizes;
    
    (<BaseQueueInterface>ImageDownloadQueue).dispatch({
      url : props.url,
      sizes : sizes
    },function(props : any){
      console.log('(<BaseQueueInterface>ImageDownloadQueue).dispatch ',props);
    }).setJobId(job_id).setTimeout(1000);

    /* Create key for socket too */
    return {
      socket_url : AppConfig.ROOT_DOMAIN+'/socket',
      key : job_id
    }
  }
});