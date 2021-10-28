import { Router } from "express";

import { authenticationRouter } from "./authentication.routes";
import { usersRouter } from "./users.routes";

const router = Router();

router.use("/", authenticationRouter);
router.use("/users", usersRouter);

export { router };
