import express from "express";
import { ResortDataModel } from "../models/ResortData.js";

const router = express.Router();

router.get("/get-helper-file", async (req, res) => {
  try {
    const response = await ResortDataModel.find({});
    res.json(response);
  } catch (error) {
    console.error(error);
  }
});

export { router as dataSeedRouter };
