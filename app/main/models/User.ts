import BaseModel, { BaseModelInterface } from "@root/base/BaseModel";


const User = BaseModel.extend<BaseModelInterface>({
  model : 'users'
});

export default User;