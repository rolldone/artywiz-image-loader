import { MinIO } from "../tool";

export default function(next : Function){
  try{
    global.minio = MinIO();
    return next(null);
  }catch(ex){
    throw ex;
  }
}