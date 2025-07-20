const { date } = require("joi");
const { signupSchema, signinSchema } = require("../middleware/validator");
const User = require("../models/user-model");
const { doHash, doHashValidation } = require("../utils/hash");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signupSchema.validate({ email, password });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        success: false,
        message: "User with the email already exists!",
      });
    }
    const hashedPassword = await doHash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
    });
    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      result,
    });
  } catch (e) {
    console.log(e);
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signinSchema.validate({ email, password });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist!",
      });
    }
    const result = await doHashValidation(password, user.password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        verified: user.verified,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "8h",
      }
    );

    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 60 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        token,
        message: "Logged in successfully!",
      });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { signup, signin };
