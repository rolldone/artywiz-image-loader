import { AsyncJs } from "../tool";
import StartConfig from "./StartConfig";
import StartExpress from "./StartExpress";
import StartMasterData from "./StartMasterData";
import StartMinIO from "./StartMinIO";
import StartNohm from "./StartNohm";
import StartPubSub from "./StartPubSub";
import StartRedisPubSub from "./StartRedisPubSub";
import StartRedisClient from '@root/bootstrap/StartRedisClient';
const task = [
  StartPubSub,
  StartMasterData,
  StartConfig,
  StartRedisPubSub,
  StartMinIO,
  StartExpress,
  StartRedisClient
  /* Other bootstrap ? */
];

export default function(asyncDone : Function){
  AsyncJs.series(task,function(err,result){
    if(err){
      return console.error(err);
    }
    console.log('Initialize Bootstrap Is Done!');
    asyncDone(null);
  })
}