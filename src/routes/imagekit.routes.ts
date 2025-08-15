import express from "express";
import { imagekitAuthentication } from "../controllers/imagekit.controller";

const router = express.Router();

router.get("/auth", imagekitAuthentication);

export default router;
