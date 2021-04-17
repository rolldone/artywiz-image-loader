import BaseQueue from "@root/base/ts/BaseQueue";
import ImageCacheService from "../services/ImageCacheService";
export default class ImageCacheQueue extends BaseQueue{
  queue_name = 'IMAGE_CACHE_DATA';
  returnImageCacheService(){
    return new ImageCacheService();
  }
  async process(job : any, done : Function){
    try{
      let imageCacheService = this.returnImageCacheService();
      // let test = await imageCacheService.getImage(job.id);
      imageCacheService.saveImage({
        data : job.data.data,
        size : job.data.size,
        file_name : job.id,
        url : job.data.url
      });
      done(null);
    }catch(ex){
      console.error('StoreDataToMinio - errorException ',ex);
      done(null)
    }
  }
  
}