import BaseQueue from "@root/base/BaseQueue";
import MinioService, { MinioServiceInterface } from "../services/MinioService";

export interface StoreDataToMinioInterface extends BaseQueueInterface{
  returnMinioService : {():MinioServiceInterface},
  dispatch ?: {(props : {
    bucketName : String,
    fileName : String,
    data : string
  }, callback : Function) : StoreDataToMinioInterface }
}

const StoreDataToMinio : StoreDataToMinioInterface =  BaseQueue.extend(<StoreDataToMinioInterface>{
  queue_name : 'MINIO_STORE_DATA',
  returnMinioService(){
    return MinioService.create();
  },
  async process(job : any, done : Function){
    try{
      let minio = this.returnMinioService();
      await minio.createBucket(job.data.bucketName,"");
      let resData = await minio.getImage({
        bucketName : job.data.bucketName,
        fileName : job.data.fileName,
      });
      if(resData == null){
        await minio.putImageObject({
          bucketName : job.data.bucketName,
          data : job.data.data,
          fileName : job.data.fileName
        });
      }
      // if(resData != Buffer.from(job.data.data,'base64')){
      //   console.log(`resData != Buffer.from(job.data.data,'base64') -> `,false);
      //   await minio.putImageObject({
      //     bucketName : job.data.bucketName,
      //     data : job.data.data,
      //     fileName : job.data.fileName
      //   });
      // }
      done(null);
    }catch(ex){
      console.error('StoreDataToMinio - process - error ',ex);
      done(null)
    }
  }
});

export default StoreDataToMinio;