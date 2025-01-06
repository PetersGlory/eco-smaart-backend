const express = require("express");
const bcrypt = require("bcrypt");
const { User, Otp, Admin } = require("../models");
const tokenGenerate = require("../libs/generateToken");
const sendOtp = require("../libs/sendOtp");
const MobileAppAuthMiddleware = require("../middleware/userMiddleware");

const router = express.Router();
const saltRounds = 10;

function generateFourDigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}


// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(422).json({ message: "Invalid password" });
    }
    const token = tokenGenerate({ email: email });
    const itpCode = generateFourDigitNumber();

    // await Otp.create({
    //   email,
    //   otp_code: itpCode,
    // });
    console.log(token)

    // await sendOtp({ email: email, otpCode: itpCode });
    return res.json({ message: "Login successful", token, error:false, profile:user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
});

// Fetching All users
router.get("/users", MobileAppAuthMiddleware, async (req, res) => {
  const {email} = req.user;
  try {
      const existingUser = await Admin.findOne({where:{email}});

      if(!existingUser){
          return res.status(422).send({ message: "Profile not found", error: true });
      }
      const users = await User.findAll();
      return res.status(200).json({ message: "Users Fetched Successfully", error: false, data: users });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error geting tips", error: error.message });
  }
});

module.exports = router;
