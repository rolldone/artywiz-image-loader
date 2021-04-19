import Helpers from "@root/tool/Helpers";
import ImageLoaderQueue from "../queue/ImageLoaderQueue";
import BaseService, { BasicBaseServiceInterface } from "./BasicBaseService";
const md5 = require('md5');

export interface ImageLoaderServiceInterface extends BaseServiceInterface{
  createJobImageLoader : {(props : object):Promise<string>}
}

const ImageLoaderService : ImageLoaderServiceInterface = BaseService.extend(<ImageLoaderServiceInterface>{
  async createJobImageLoader(props : any){
    let validator = this.returnValidator(props,{
      url : 'required',
      size : 'required'
    });
    switch(await validator.check()){
      case validator.fails == true:
        throw global.CustomError('error.validation_exception',JSON.stringify(validator.errors.all()));
    }
    props.created_at = new Date().getUTCMilliseconds();
    let hash : string = Helpers.generateImagePersistentJobId(props.url,props.size);
    // let queue = await ImageLoaderQueue.getJob(hash);
    ImageLoaderQueue.dispatch(props,function(props){
      console.log('hash -> ',hash);
      console.log('queue -> ',props);
      // console.log('props',props);
    }).setTimeout(1).setJobId(hash);
    return hash;
  }
});

export default ImageLoaderService;