var NameRouter = require('named-routes');
import express, { Router } from 'express';
const uberproto = require('uberproto');

export interface BaseRouteInterface{
  childRouter ?: express.Router
  router ?: typeof NameRouter
  app ?: any
  _path ?: string
  _middleware ?: Array<any>
  set ?: Function
  use ?: Function
  get ?: Function
  post ?: Function
  baseRoute : string 
  onready : Function
}

export default uberproto.extend({
  __init : 'construct',
  construct(app : any){
    this.router.extendExpress(app);
    this.router.registerAppHelpers(app);
    this.app = app;
    /* Child route inside .use */
    this.childRouter = express.Router();
    this.router.extendExpress(this.childRouter);
    this.onready();
  },
  childRouter : null,
  router : new NameRouter(),
  app : null,
  baseRoute : '',
  _path : '',
  _middleware : [],
  onready(){
    console.log('onready - Override this function');
  },
  // use : function(path,middleware=[],callbackRouter){
  //   path = this.baseRoute+path;
  //   callbackRouter(this);
  //   this.app.use(path,middleware,this.childRouter);
  // },
  use(path : string,middleware : Array<any>=[],callbackRouter : Function) : void{
    this._path = path;
    this._middleware = middleware;
    callbackRouter(this);
  },
  set(action : string,...props : Array<any>){
    props[0]=this.baseRoute+(this._path||'')+props[0];
    console.log('action',action);
    console.log('props',props);
    console.log('_path',this._path);
    props[2] = [
      this._middleware,
      ...props[2]
    ]
    console.log('action -> ',props[0]);
    this.app[action].call(this.app,...props);
  },
  get(...props:Array<any>){
    this.set('get',...props);
  },
  post(...props:Array<any>){
    this.set('post',...props);
  },
  displayRoute(req : any, res : any){
    let routesByNameAndMethod = (function(datas){
      let newKeys = [];
      for(var key in datas){
        newKeys.push(key);
      }
      return newKeys;
    })(this.router.routesByNameAndMethod);
    let callbacksByPathAndMethod = (function(datas){
      let newKeys = [];
      for(var key in datas){
        newKeys.push(key);
      }
      return newKeys;
    })(this.router.callbacksByPathAndMethod);
    let displayRoutes : any = {};
    for(var a=0;a<routesByNameAndMethod.length;a++){
      displayRoutes[routesByNameAndMethod[a]] = callbacksByPathAndMethod[a];
    }
    displayRoutes = {
      status : 'success',
      status_code : 200,
      return : displayRoutes
    }
    return res.status(displayRoutes.status_code).send(displayRoutes);
  }
} as BaseRouteInterface)