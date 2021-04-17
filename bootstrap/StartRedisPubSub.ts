import { RedisPubSub } from "../tool";
import Redis from 'redis';
import RedisConfig from "@root/config/RedisConfig";

export default function StartRedisPubSub(next : Function){
  const redisPub = Redis.createClient({
    port: RedisConfig.port,
    host: RedisConfig.host,
    // auth: Env.REDIS_AUTH,
    no_ready_check: true,
  });
  redisPub.auth(RedisConfig.auth);
  const redisSub = Redis.createClient({
    port: RedisConfig.port,
    host: RedisConfig.host,
    // auth: Env.REDIS_AUTH,
    no_ready_check: true,
    // return_buffers: true
  });
  redisSub.auth(RedisConfig.auth);
  let nrpConfig = {
    emitter: redisPub,
    receiver: redisSub,
    scope : 'artywiz-image-generator'
  };
  global.nrp = RedisPubSub(nrpConfig);
  return next(null);
}