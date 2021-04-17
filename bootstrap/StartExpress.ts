import { Express} from "../tool";

export default function(next : Function){
  try{
    const app = Express();
    global.app = app;
    global.Server = require('http').Server(app);
    global.app.listen(3001, () => {
      console.log(`Example app listening}`)
    });
    return next(null);
  }catch(ex){
    throw ex;
  }
}