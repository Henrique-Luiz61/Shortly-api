import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controllers.js";
import { signUpSchema, signInSchema } from "../schemas/auth.schemas.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(signUpSchema), signUp);
authRouter.post("/signin", validateSchema(signInSchema), signIn);

export default authRouter;
