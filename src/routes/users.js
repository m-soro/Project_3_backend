import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    // get the username and password from request body
    const { username, password } = req.body;
    // find a user with the same username fron the register form in database
    const user = await UserModel.findOne({ username });
    // check if user is already in the database
    if (user) res.json({ message: "User already exists. Please log in." });
    // create a hashed password to send to database
    const hashedPassword = await bcrypt.hash(password, 10);
    // add user to database, based on User model
    const newUser = new UserModel({ username, password: hashedPassword });
    // then save it
    await newUser.save();
    res.json({ message: "Your account is created. Please log in." });
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    // get username and password from form body
    const { username, password } = req.body;
    // find a user with the same username fron the register form in database
    const user = await UserModel.findOne({ username });
    // check if user already exist
    if (!user)
      res.json({
        message: "Account does not exist. Please create an account.",
      });
    // use bcrypt.compare to check if entered password and hashed password in database is the same
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      res.json({ message: "Username or password is incorrect." });
    // create token, sign user id, the second part is use to verify the authenticated user

    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    res.json({ token, userID: user._id });
  } catch (error) {
    console.error(error);
  }
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRET, (error) => {
      if (error) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
