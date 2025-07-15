const { signupSchema } = require("../middleware/validator");
const User = require("../models/user-model");
const doHash = require("../utils/hash");

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
      result
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { signup };
