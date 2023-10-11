import express from "express";
import mongoose from "mongoose";
import { MountainModel } from "../models/Resorts.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

// INDUCES

// INDEX
router.get("/", async (req, res) => {
  try {
    const response = await MountainModel.find({});
    res.json(response);
  } catch (error) {
    console.error(error);
  }
});

// create mountain list
router.post("/", async (req, res) => {
  const mountain = new MountainModel(req.body);
  try {
    const response = await mountain.save();
    res.json(response);
  } catch (error) {
    console.error(error);
  }
});

// save the mountain that uses selected to the users saved mountains array
router.put("/", async (req, res) => {
  // in the model, change the userSchema to add the mountainId
  try {
    const mountain = await MountainModel.findById(req.body.mountainID);
    const user = await UserModel.findById(req.body.userID);
    user.savedMountains.push(mountain);
    await user.save();
    res.json({ savedMountains: user.savedMountains });
  } catch (error) {
    console.error(error);
  }
});

router.get("/savedMountains/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedMountains: user?.savedMountains });
  } catch (error) {
    res.json(error);
  }
});

router.get("/update/:id", async (req, res) => {
  try {
    const foundMountain = await MountainModel.findById(req.params.id);
    res.json({
      message: foundMountain,
    });
  } catch (error) {
    console.log(error);
  }
});

// Route for update - endpoint working tested in postman
// this is the submit button in the form
router.put("/update/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await MountainModel.findByIdAndUpdate(id, request.body);
    if (!result) {
      return response.status(404).json({ message: "List not found" });
    }
    return response.status(200).json({ message: "List updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete Route - endpoint working tested in postman
router.delete("/delete/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    await MountainModel.findByIdAndRemove(req.params.id);
    res.json({ message: "Successfully deleted" });
  } catch (error) {
    console.log(error);
  }
});

export { router as mountainRouter };
