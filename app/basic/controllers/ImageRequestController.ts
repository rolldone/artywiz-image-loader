import BaseController from "@root/base/ts/BaseController";
import express from 'express';
import ImageLoaderService from "../services/ImageLoaderService";

export default class ImageReequestController extends BaseController{
  constructor(){
    super();
    this.index = this.index.bind(this);
  }
  returnImageLoaderService(){
    return new ImageLoaderService();
  }
  async index(req : express.Request ,res : express.Response){
    try{
      let self = this;
      console.log('controller comming !');
      let props = this.getBaseQuery(req,{
        url : req.query.url || 'https://media.wired.com/photos/5a0201b14834c514857a7ed7/master/w_2560%2Cc_limit/1217-WI-APHIST-01.jpg',
        size : parseInt(req.query.size as any) || 500
      });
      let service = this.returnImageLoaderService();
      let resData1 = await service.createJobImageLoader(props);
      var waitingData = function(resData : string){
        return new Promise(function(resolve){
          var unsubscribe : any = null;
          var test : string = null;
          var currentProcess = `test = function(props){
            // console.log('jobid -> ',props);
            // console.log('resData -> ',resData);
            // console.log('prefix');
            resolve({
              data : props,
              remove_listener : test
            });
            unsubscribe(function(){
              // console.log(test.toString());
            });
          };`
          let r = Math.random().toString(36).substring(7);
          currentProcess = currentProcess.toString().replace('prefix',r);
          eval(currentProcess);
          unsubscribe = global.nrp.on(resData,test);
        })
      }
      let result : any = await waitingData(resData1);
      res.writeHead(200, { 'Content-Type': 'image/png' });
      result.data = Buffer.from(result.data, 'base64')
      res.end(result.data);
    }catch(ex){
      console.log(this);
      return this.returnSimpleError(ex,res);
    }
  }
  
}