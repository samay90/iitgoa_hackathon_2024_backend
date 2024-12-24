const express = require("express");
const authRouter = require("../controllers/auth");
const routes = express.Router();
const tokenVerifier = require("../helpers/middleware/auth_user");
const userRouter = require("../controllers/user");

routes.use("/auth",authRouter);
routes.use("/user",tokenVerifier,userRouter)
module.exports = routes