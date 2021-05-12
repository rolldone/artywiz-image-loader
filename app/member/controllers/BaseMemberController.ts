import BaseController from '@root/base/BaseController';

export interface BaseMemberControllerInterface extends BaseControllerInterface{}
const BaseMemberController = BaseController.extend<BaseMemberControllerInterface>({});

export default BaseMemberController;
