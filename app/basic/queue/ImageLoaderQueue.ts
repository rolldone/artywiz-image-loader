import BaseQueue from "@root/base/ts/BaseQueue";
import sharp from 'sharp';
import axios from 'axios';
import StoreDataToMinio from "./StoreDataToMinio";
import MinioService from "../services/MinioService";
import ImageCacheQueue from "./ImageCacheQueue";



export default class ImageLoaderQueue extends BaseQueue{
  queue_name = 'IMAGE_LOADER_QUEUE';
  returnMinioService(){
    return new MinioService();
  }
  getCache(id : string){
    return new Promise(function(resolve){
      global.redis.get(id,function(err:any, data : any){
        if(data == null){
          return resolve(null);
        }
        return resolve(data);
      });
    })  
  }
  async process(job : any, done : Function){
    try{
      console.log(this.getQueueName()+' job is running');
      var cache = await this.getCache(job.id);
      if(cache != null){
        // global.pubsub.emit(job.id,cache);
        global.nrp.emit(job.id,cache);
        return done(null);
      }else{
        /* Check on minio first */
        let minio = this.returnMinioService();
        let existImageMinio = await minio.getImage({
          bucketName : job.data.size+"",
          fileName : job.id+".png"
        });
        if(existImageMinio == null){
          console.log('existImageMinio -> ',existImageMinio);
          const input = (await axios({ url: job.data.url, responseType: "arraybuffer" })).data as Buffer;
          sharp(input)
            .resize(job.data.size)
            .toBuffer()
            .then((data) => {

              if (data instanceof Buffer)
              ImageCacheQueue.dispatch({
                data : data.toString('base64'),
                size : job.data.size,
                file_name : job.id,
                url : job.data.url
              },function(props : any){
                console.log('ImageCacheQueue.dispatch - ',props);
              }).setTimeout(1000).setJobId(job.id);

              StoreDataToMinio.dispatch({
                bucketName : job.data.size+"",
                fileName : job.id+".png",
                data : data,
              } as {
                bucketName : String,
                fileName : String,
                data : any
              },function(props : any){
                console.log('StoreDataToMinio.dispatch - ',props);
              }).setTimeout(1000).setJobId(job.id);

              // global.pubsub.emit(job.id,data);
              global.nrp.emit(job.id,data);
              done(null);
            })
            .catch((err)=>{
              console.log('err - ImageLoaderQueue -> ',err)
              // global.pubsub.emit(job.id,err);
              global.nrp.emit(job.id,err);
              done(true);
            })
        }else{
          global.nrp.emit(job.id,existImageMinio);
          if (existImageMinio instanceof Buffer)
          ImageCacheQueue.dispatch({
            data : existImageMinio.toString('base64'),
            size : job.data.size,
            file_name : job.id,
            url : job.data.url
          },function(props : any){
            console.log('ImageCacheQueue.dispatch - ',props);
          }).setTimeout(1000).setJobId(job.id);
          done(null);
        }
      }
    }catch(ex){
      done(true);
      console.log('ImageLoaderQueue - ex ',ex);
    }
    
  }
}