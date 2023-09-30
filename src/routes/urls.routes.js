import { Router } from "express";
import {
  postUrls,
  getUrlsById,
  deleteUrls,
  getOpenShortUrl,
} from "../controllers/urls.controllers.js";
import { urlSchema } from "../schemas/urls.schemas.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateSchema(urlSchema), postUrls);
urlsRouter.get("/urls/:id", getUrlsById);
urlsRouter.get("/urls/open/:shortUrl", getOpenShortUrl);
urlsRouter.delete("/urls/:id", deleteUrls);

export default urlsRouter;
