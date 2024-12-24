const express = require("express");
const authRouter = require("../controllers/auth");
const routes = express.Router();
const tokenVerifier = require("../helpers/middleware/auth_user");
const userRouter = require("../controllers/user");
const messRouter = require("../controllers/mess");

routes.use("/auth",authRouter);
routes.use("/user",tokenVerifier,userRouter)
routes.use("/mess",tokenVerifier,messRouter)
module.exports = routes