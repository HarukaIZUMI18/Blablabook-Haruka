import Joi from "joi";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { User } from "../models/index.js";

export const userController = {
  async UserInfo(req, res) {
    const userId = req.userId;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  },
};
