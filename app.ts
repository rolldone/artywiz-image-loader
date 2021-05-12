import 'source-map-support/register'
require('module-alias/register')
const {multithread, runOnce} = require('node-multithread');
import BaseStart, { BaseStartInterface } from './base/BaseStart';
import bootstrap from './bootstrap';
import { Web, Api } from '@root/routes/v1/index';
import { AppConfig } from './config';
interface AppInterface extends BaseStartInterface {
  /* Todo some extra types */
}

multithread(() => {
  BaseStart({
    port : null,
    init : [
      /* Your code Bootstrap here */
      bootstrap,
      /* Your can define your own stack bootstrap here */
      function(callback : Function){
        /* You can Define route here */
          Web.create(global.app);
          Api.create(global.app);
          callback(null);
      }],
    run : function(){
      /* Server is ready! */
      /* You can create some programatic code here */
    }
  } as AppInterface);
},AppConfig.APP_THREAD_PROCESS);