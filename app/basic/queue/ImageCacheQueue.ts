import BaseQueue from "@root/base/ts/BaseQueue";
import ImageCacheService, { ImageCacheInterface } from "../services/ImageCacheService";

export interface ImageCacheQueueInterface extends BaseQueueInterface{
  returnImageCacheService : {() : ImageCacheInterface}
}

const ImageCacheQueue : ImageCacheQueueInterface = BaseQueue.extend(<ImageCacheQueueInterface>{
  queue_name : 'IMAGE_CACHE_DATA',
  returnImageCacheService(){
    return ImageCacheService.create();
  },
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
      console.error('StoreDataToMinio - process - error ',ex);
      done(null)
    }
  }
});

export default ImageCacheQueue;