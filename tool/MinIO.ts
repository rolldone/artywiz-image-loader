import MinIOConfig, { MinioInterface } from "../config/MinIOConfig";
var MinIO = require('minio');

export default function(){
  try{
    var minioClient = new MinIO.Client({
      endPoint: MinIOConfig.endPoint,
      port: MinIOConfig.port,
      useSSL: MinIOConfig.useSSL,
      accessKey: MinIOConfig.accessKey,
      secretKey: MinIOConfig.secretKey
    });
    return minioClient;
  }catch(ex){
    throw ex;
  }
};
