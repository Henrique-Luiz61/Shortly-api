import { Router } from "express";
import { postUrls } from "../controllers/urls.controllers.js";
import { urlSchema } from "../schemas/urls.schemas.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateSchema(urlSchema), postUrls);

export default urlsRouter;
