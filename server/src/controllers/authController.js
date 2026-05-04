import jwt from "jsonwebtoken";
import { body } from "express-validator";
import User from "../models/User.js";
import { fail, ok } from "../utils/helpers.js";

export const registerRules = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("shopName").optional().isString(),
  body("phone").optional().isString(),
  body("password").isLength({ min: 6 })
];
export const loginRules = [body("email").isEmail(), body("password").notEmpty()];
export const updateProfileRules = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("shopName").optional().isString(),
  body("phone").optional().isString()
];

function tokenFor(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function checkSetup(_req, res) {
  const users = await User.countDocuments();
  ok(res, { registered: users > 0, multiUser: true }, "Setup status loaded");
}

export async function register(req, res) {
  const user = await User.create(req.body);
  ok(res, { id: user._id, name: user.name, email: user.email, shopName: user.shopName, phone: user.phone }, "Registration complete", 201);
}

export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) return fail(res, "Invalid email or password", 401);
  ok(res, { token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email, shopName: user.shopName, phone: user.phone } }, "Login successful");
}

export async function me(req, res) {
  ok(res, req.user, "User loaded");
}

export async function updateProfile(req, res) {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email, shopName: req.body.shopName, phone: req.body.phone },
    { new: true, runValidators: true }
  ).select("-password");
  ok(res, user, "Profile updated");
}
