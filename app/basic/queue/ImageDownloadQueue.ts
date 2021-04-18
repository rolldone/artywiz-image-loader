import BaseQueue from "@root/base/ts/BaseQueue";
import axios from "axios";
import ImageDownloadResizeQueue from "./ImageDownloadResizeQueue";

export default BaseQueue.extend(<BaseQueueInterface>{
  queue_name : 'IMAGE_DOWNLOAD_QUEUE_',
  async process(job,done){
    try{
      const input = (await axios({ url: job.data.url, responseType: "arraybuffer" })).data as Buffer;
      (<BaseQueueInterface>ImageDownloadResizeQueue).dispatch({
        key : '',
        data : input.toString('base64')
      } as {
        key : string
      },function(props : any){
        console.log('ImageDownloadResizeQueue -> ',props);
        done(null);
      }).setJobId(job.id).setTimeout(1000);
    }catch(ex){
      done(true);
    }
  }
});