import BaseMemberController, { BaseMemberControllerInterface } from "../BaseMemberController";
import {Request, Response} from 'express';

export interface ManageUserControllerInterface extends BaseMemberControllerInterface {
  updateCurrentUser: { (req: Request, res: Response): void }
  getCurrentUser: { (req: Request, res: Response): void }
}

const ManageUserController = BaseMemberController.extend<ManageUserControllerInterface>({
  updateCurrentUser: function (req: Request, res: Response) {

  },
  getCurrentUser: function (req: Request, res: Response) {

  }
});

export default ManageUserController;