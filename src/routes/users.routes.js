import { Router } from "express";
import { getUsers, getRanking } from "../controllers/users.controllers.js";

const usersRouter = Router();

usersRouter.get("/users/me", getUsers);
usersRouter.get("/ranking", getRanking);

export default usersRouter;
