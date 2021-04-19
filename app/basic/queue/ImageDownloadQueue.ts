import BaseQueue from "@root/base/ts/BaseQueue";
import axios from "axios";
import ImageDownloadResizeQueue from "./ImageDownloadResizeQueue";

export interface ImageDownloadQueueInterface extends BaseQueueInterface{
  dispatch ?: {(props : {
    url : string
    sizes : Array<any>
  },callback : Function) : ImageDownloadQueueInterface }
} 

const ImageDownloadQueue : ImageDownloadQueueInterface = BaseQueue.extend(<ImageDownloadQueueInterface>{
  queue_name : 'IMAGE_DOWNLOAD_QUEUE_',
  async process(job,done){
    let self = this;
    try{
      let validator = self.returnValidator(job.data,{
        url : 'required',
        sizes : 'required'
      });
      switch(await validator.check()){
        case validator.fails:
          throw global.CustomError('error.validation',JSON.stringify(validator.errors.all()));
      }
      const input = (await axios({ url: job.data.url, responseType: "arraybuffer" })).data as Buffer;
      ImageDownloadResizeQueue.dispatch({
        url : job.data.url,
        sizes : job.data.sizes,
        data : input.toString('base64')
      },function(props){
        if(props.err == true){
          console.log('ImageDownloadResizeQueue - dispatch - error -> ',props);
          done(props.err);
          return;
        }
        done(null);
      }).setJobId(job.id).setTimeout(1000);
      
    }catch(ex){
      console.log('ImageDownloadQueue - pricess - error -> ',ex);
      done(ex);
    }
  }
});

export default ImageDownloadQueue;