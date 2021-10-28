import { Router } from "express";

import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { UpdateUserController } from "../../../../modules/users/useCases/updateUser/UpdateUserController";
// import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();

const usersRoutes = Router();

usersRoutes.post("/", createUserController.handle);
usersRoutes.put("/:id", updateUserController.handle);

// usersRoutes.get("/", ensureAuthenticated, profileUserController.handle);

export { usersRoutes };
