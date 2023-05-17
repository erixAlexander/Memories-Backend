import express from "express";
const router = express.Router();
import { signin } from "../controllers/googleController.js";

router.post("/", signin);

export default router;
