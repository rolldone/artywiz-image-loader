import BaseService from "./BasicBaseService"

export interface MinioPutObjectInterface{
  data : any,
  bucketName : String,
  fileName : String,
  contentType ?: String 
}

export interface MinioGetImageInterface{
  bucketName : String,
  fileName : String,
  contentType ?: String 
}

export interface MinioServiceInterface extends BaseServiceInterface{
  baseBucketName : string
  createBucket : {(bucketName : string, region : any) : Promise<boolean>}
  putImageObject : {(props : MinioPutObjectInterface) : Promise<object>}
  getImage : {(props : MinioGetImageInterface) : Promise<object>}
}

const MinioService : MinioServiceInterface = BaseService.extend(<MinioServiceInterface>{
  /* Important */
  /* Bucket name is strict please read this documentation
     https://docs.rightscale.com/faq/clouds/aws/What_are_valid_S3_bucket_names.html#:~:text=Bucket%20names%20should%20not%20contain,3%20and%2063%20characters%20long */
  baseBucketName : 'imgch-',
  createBucket(bucketName : string, region : any = null){
    let self = this;
    return new Promise(function(resolve){
      bucketName = self.baseBucketName + bucketName;
      global.minio.bucketExists(bucketName, function(err : any,exists : boolean) {
        console.log('global.minio.bucketExists -> ',err);
        if (err) {
          if (err.code == 'NoSuchBucket') {
            global.minio.makeBucket(bucketName, region, function(err2 : any) {
              if (err2) {
                console.log("error on creating bucket", err2);
              }
              resolve(true);
            });
          }
          return;
        }
        if (exists == true) {
          resolve(true);
          return console.log('Bucket exists.')
        }else{
          global.minio.makeBucket(bucketName, region, function(err2 : any) {
            if (err2) {
              console.log("error on creating bucket", err2);
            }
            resolve(true);
          });
        }
        console.log('Bucket exists:', bucketName);
      });
    });
  },
  putImageObject(props : MinioPutObjectInterface){
    let self = this;
    return new Promise(function(resolve, reject){
      var metaData : any = {
        'Content-Type': 'image/png',
        // 'X-Amz-Meta-Testing': 1234,
        // 'example': 5678
      }
      let bucketName = self.baseBucketName+props.bucketName+"";
      global.minio.putObject(bucketName, props.fileName, Buffer.from(props.data,'base64'), metaData, function(err : any, etag : any) {
        if (err){
          console.log('err',err);
          reject(err);
          return;
        }
        resolve(etag);
        console.log('File uploaded successfully.');
      });
    })
  },
  getImage(props : MinioGetImageInterface) {
    let self = this;
    return new Promise(function(resolve, rejected){
      let data : any = null;
      global.minio.getObject(self.baseBucketName+props.bucketName, props.fileName, function(err : any, objStream : any) {
        if (err) {
          resolve(null);
          return console.log('getImage -> ',err.message);
        }
        objStream.on('data', function(chunk : any) {
          data = !data ? Buffer.from(chunk,'base64') : Buffer.concat([data, chunk]);
        })
        objStream.on('end', function() {
          resolve(data);
        })
        objStream.on('error', function(err : any) {
          rejected(err);
        })
      });
    });
	}
});

export default MinioService;