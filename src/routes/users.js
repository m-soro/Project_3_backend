import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  // get the username and password from request body
  const { username, password } = req.body;
  // find a user with the same username fron the register form in database
  const user = await UserModel.findOne({ username });
  // check if user is already in the database
  if (user) res.json({ message: "User already exists!" });
  // create a hashed password to send to database
  const hashedPassword = await bcrypt.hash(password, 10);
  // add user to database, based on User model
  const newUser = new UserModel({ username, password: hashedPassword });
  // then save it
  await newUser.save();
  res.json({ message: "user successfully added" });
});

router.post("/login");

export { router as userRouter };
