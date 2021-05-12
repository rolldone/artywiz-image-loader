import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";


const Client = BaseModel.extend<BaseModelInterface>({
  model : 'clients'
});

export default Client;