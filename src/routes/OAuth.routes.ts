import express from "express";
import {
  getUserDetailsAndCreateUserOrLogin,
  redirectGoogleAuthUrl,
} from "../controllers/OAuth.controller";

const router = express.Router();

router.get("/google/redirect", redirectGoogleAuthUrl);
router.post("/google/callback", getUserDetailsAndCreateUserOrLogin);

export default router;
