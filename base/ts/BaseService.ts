import { Moment, Validator } from "@root/tool";

export default class BaseService{
  returnValidator(form_data : Object,form_rule : Object){
    return new Validator(form_data,form_rule);
  }
  returnMoment(){
    return Moment();
  }
}