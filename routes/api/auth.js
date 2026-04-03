import express from "express";
import jwtMiddleware from "../../middleware/auth.js";
import User from "../../models/User.js";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// @route    GET api/auth
// @desc     Test route
// @access   Public

router.get("/", jwtMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user.avatar && user.avatar.startsWith("//")) {
      user.avatar = "https:" + user.avatar;
      await user.save();
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

// @route    POST api/auth
// @desc     Authenticate user & Get token
// @access   Public

router.post(
  "/",
  [
    check("email", "Please include a valid Email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      // See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      // Return JWT
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server Error", details: err.message });
    }
  },
);

export default router;
