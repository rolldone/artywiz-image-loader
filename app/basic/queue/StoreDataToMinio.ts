import BaseQueue from "@root/base/ts/BaseQueue";
import MinioService from "../services/MinioService";

export default class StoreDataToMinio extends BaseQueue{
  queue_name = 'MINIO_STORE_DATA';
  returnMinioService(){
    return new MinioService();
  }
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
      console.error('StoreDataToMinio - errorException ',ex);
      done(null)
    }
  }
  
}