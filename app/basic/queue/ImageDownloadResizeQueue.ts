import BaseQueue from "@root/base/BaseQueue";
import Helpers from "@root/tool/Helpers";
import sharp from "sharp";
import ImageCacheQueue from "./ImageCacheQueue";
import StoreDataToMinio from "./StoreDataToMinio";
const {serializeError, deserializeError} = require('serialize-error');

const md5 = require('md5');

interface ImageDownloadResizeQueueInterface extends BaseQueueInterface {
  dispatch ?: {(props : {
    sizes : Array<Number>
    url : string
    data : string
  }, callback : { (props : {
    err : boolean | null
    return : object | null
  }) : void }  ) : ImageDownloadResizeQueueInterface}
  sequentialProcessing : {(jobId : string, imageBuffer : Buffer, size : number) : Promise<object>}
}

interface sequentialProcessingResultInterface { 
  count : number,
  success : boolean,
  key : string,
  size : Array<number>,
  total ?: number
}

const ImageDownloadResizeQueue : ImageDownloadResizeQueueInterface = BaseQueue.extend(<ImageDownloadResizeQueueInterface>{
  queue_name : 'IMAGE_DOWNLOAD_RESIZE_QUEUE_',
  sequentialProcessing : function(jobId, imageBuffer, size){
    return new Promise(function(resolve){
      sharp(imageBuffer)
        .resize(size)
        .toBuffer()
        .then((data) => {
          /* Karena disini process jadi banyak jenis image dalam 1 file yang sama */
          if (data instanceof Buffer)
          ImageCacheQueue.dispatch({
            data : data.toString('base64'),
            size : size,
            file_name : jobId,
            url : ""
          },function(props){
            console.log('ImageCacheQueue.dispatch - ',props);
          }).setTimeout(1000).setJobId(jobId);

          StoreDataToMinio.dispatch({
            bucketName : size+"",
            fileName : jobId+".png",
            data : data.toString('base64'),
          },function(props : any){
            console.log('StoreDataToMinio.dispatch - ',props);
          }).setTimeout(1000).setJobId(jobId);

          resolve({
            key : jobId,
            size : size,
            count : 1,
            success : true
          });
          // global.pubsub.emit(job.id,data);
        })
        .catch((err)=>{
          console.log('err - ImageLoaderQueue - sequentialProcessing -> ',err)
          // global.pubsub.emit(job.id,err);
          // global.nrp.emit(jobId,err);
          resolve({
            count : 1,
            success : false,
            key : jobId,
            size : size,
          });
        })
    });
  },
  async process(job,done){
    try{
      let self = this;
      let validator = self.returnValidator(job.data,{
        sizes : 'required',
        url : 'required',
        data : 'required'
      });
      switch(await validator.check()){
        case validator.fails:
          throw global.CustomError('error.validation',JSON.stringify(validator.errors.all()));
      }
      let sizes = job.data.sizes;
      let count = [];
      /* Fil only url */
      /* Convert to buffer forst */
      let bufferData = Buffer.from(job.data.data,'base64');
      for(var a=0;a<sizes.length;a++){
        let hashMd5 = Helpers.generateImagePersistentJobId(job.data.url,sizes[a]);
        let result = await this.sequentialProcessing(hashMd5, bufferData, sizes[a]) as sequentialProcessingResultInterface;
        count.push(<sequentialProcessingResultInterface>{
          ...result,
          total : sizes.length as number
        });
        global.nrp.emit(job.id,count);
      }
      done(null);
    }catch(ex){
      console.log('ImageDownloadResizeQueue - process - error -> ',ex);
      global.nrp.emit(job.id,ex);
      done(ex);
    }
  }
});

export default ImageDownloadResizeQueue;