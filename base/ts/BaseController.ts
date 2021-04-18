import express from 'express';
import BaseProto from './BaseProto';
const {serializeError, deserializeError} = require('serialize-error');

export default BaseProto.extend({
  construct(){
    let self : any= this;
    try{
      for(var key in self){
        switch(Object.prototype.toString.call(self[key])){
          case '[object String]':
          case '[object Number]':
          case '[object Object]':
              break;
          default:
            self[key] = self[key].bind(self);
            break;
        } 
      }
    }catch(ex){
      console.error('----------------------------------------------------------------------------------------------------------'); 
      console.error('error.binding_controller','=>','Maybe you want binding, but this method "'+key+'" is not a function!');
      console.error('----------------------------------------------------------------------------------------------------------'); 
      console.error(ex);
    }
  },
  getBaseQuery(req : express.Request, aditional : object) : void {
    let props : any = req.query;
    /* More manually base query here */
    props.take = req.query.take || 100;
    props.skip = req.query.page || 1;
    props.skip = props.skip - 1;
    props = {
      ...props,
      ...aditional
    }
    return props;
  },
  returnSimpleError(ex : any, res : express.Response) : void{
    res.json({
      status : 'error',
      status_code : 400,
      return : serializeError(ex)
    });
  }
} as BaseControlerInterface);