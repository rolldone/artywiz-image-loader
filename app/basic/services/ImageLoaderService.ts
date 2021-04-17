import ImageLoaderQueue from "../queue/ImageLoaderQueue";
import BaseService from "./BaseService";
const md5 = require('md5');
export default class ImageLoaderService extends BaseService{
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
    let hash : string = md5(props.url+props.size);
    // let queue = await ImageLoaderQueue.getJob(hash);
    
    ImageLoaderQueue.dispatch(props,function(props : any){
      console.log('hash -> ',hash);
      console.log('queue -> ',props);
      // console.log('props',props);
    }).setTimeout(100).setJobId(hash);
    return hash;
  }
}