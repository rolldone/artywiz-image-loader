import BaseService from "./BaseService";

interface ImageCacheInterface extends BaseServiceInterface {
  expired_cache : number
  getImage : {(fileName : string ) : void }
  saveImage : {(props : object) : void }
}

export default BaseService.extend(<ImageCacheInterface>{
  expired_cache : 259200,
  getImage(fileName : string){
    return new Promise(function(resolve){
        global.redis.get(fileName,function(err : any,data : any){
          try{
            if(err){
              resolve(null);
              return;
            }
            resolve(data);
          }catch(ex){
            resolve(null);
            throw ex;
          }
        });
    });
  },
  saveImage(props : {
    data : any,
    size : number,
    file_name : string
    url : string
  }){
    global.redis.set(props.file_name,props.data,'EX', this.expired_cache, function(data : any){
      console.log(props.file_name +' key is set');
    });
  },
});