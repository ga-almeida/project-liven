import { Router } from "express";

import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { UpdateUserController } from "../../../../modules/users/useCases/updateUser/UpdateUserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();

const usersRouter = Router();

usersRouter.post("/", createUserController.handle);
usersRouter.put("/", ensureAuthenticated, updateUserController.handle);

export { usersRouter };
