import BaseQueue from "@root/base/ts/BaseQueue";
import sharp from "sharp";
import ImageCacheQueue from "./ImageCacheQueue";
import StoreDataToMinio from "./StoreDataToMinio";

export default BaseQueue.extend(<BaseQueueInterface>{
  queue_name : 'IMAGE_DOWNLOAD_RESIZE_QUEUE_',
  process(job,done){
    try{
      sharp(job.data.data)
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
    }catch(ex){
      done(true);
    }
  }
});