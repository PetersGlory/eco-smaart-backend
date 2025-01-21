const express = require("express");
const bcrypt = require("bcrypt");
const { User, Otp } = require("../models");
const tokenGenerate = require("../libs/generateToken");
const sendOtp = require("../libs/sendOtp");

const router = express.Router();
const saltRounds = 10;

function generateFourDigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

// Registration Endpoint
router.post("/register", async (req, res) => {
  const {
    fullname,
    email,
    phone,
    password,
    country,
    city,
    referBy,
  } = req.body;

  try {
    // Check if user with the same email or phone already exists
    const existingUser = await User.findOne({ where: { email } });
    const existingPhone = await User.findOne({ where: { phone } });

    if (existingUser) {
      return res
        .status(422)
        .send({
          message: "User with email address already exists.",
          error: true,
        });
    }

    if (existingPhone) {
      return res
        .status(422)
        .send({
          message: "User with phone number already exists.",
          error: true,
        });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    await User.create({
      email,
      password: hashedPassword,
      fullname,
      country,
      phone,
      city,
      status: false,
      referral_code: "eco-" + generateFourDigitNumber() + "-smart",
      referBy,
    });


    return res
      .status(200)
      .json({
        message: "User created successfully",
        error: false
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error creating user", error: error });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(422).json({ message: "Invalid password" });
    }
    if (user == "banned") {
      return res.status(422).json({ message: "User Banned" });
    }
    const token = tokenGenerate({ email: email });
    const itpCode = generateFourDigitNumber();

    // await Otp.create({
    //   email,
    //   otp_code: itpCode,
    // });
    console.log(token)

    // await sendOtp({ email: email, otpCode: itpCode });
    return res.json({ message: "Login successful", token, otp_code:itpCode });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
});

// verify Email Code Section
router.post("/verify-otp", async (req, res) => {
  const { email, otpCode } = req.body;
  try {
    const OtpU = await Otp.findOne({ where: { email } });
    const user = await User.findOne({ where: { email } });
    if (!OtpU) {
      return res.status(404).json({ message: "Invalid Otp Code" });
    }
    // const isValidPassword = await bcrypt.compare(password, user.password);
    if (OtpU.otp_code !== otpCode) {
      return res.status(422).json({ message: "Invalid Otp" });
    }
    await Otp.destroy({ where: { id: OtpU.id } });

    return res
      .status(200)
      .json({ message: "Verification successful", error: false, data: user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
});

module.exports = router;
