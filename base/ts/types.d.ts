
interface BaseProtoInterface{
  create ?: any
  __init ?: string
  construct ?: Function
}

interface BaseControlerInterface extends BaseProtoInterface{
  getBaseQuery ?: Function
  returnSimpleError ?: {(ex : any, res : import('express').Response) : void }
}

interface BaseQueueInterface extends BaseProtoInterface{
  create ?:{(props : any, callback : Function): BaseQueueInterface}
  props ?: any
  callback ?: Function
  queue_name ?: string
  job_id ?: string
  timeout ?: number
  run ?: {() :void}
  process : {(job : any, done : Function) : void }
  dispatch ?: {(props : any,  callback : Function) : BaseQueueInterface }
  connector ?: {() : Object }
  returnQueue ?: {() : Bull.Queue}
  setJobId ?: { (jobId : string ) : BaseQueueInterface }
  getJob ?: {(jobId : string ) :void}
  getQueueName ?: {() : string }
  setTimeout ?: {(timeout : number) : BaseQueueInterface}
  getDispatchNullException ?: {() :void }
  getNameNUllException ?: {() :void }
  getTimeoutNullException ?: {() :void }
}

interface BaseServiceInterface extends BaseProtoInterface{
  returnValidator ?:{(props : object, filter : object) : ValidatorInterface}
  returnMoment ?: {() : Function }
}