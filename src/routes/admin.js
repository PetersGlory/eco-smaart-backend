const express = require("express");
const bcrypt = require("bcrypt");
const {
  User,
  Otp,
  Admin,
  DTips,
  Tips,
  Campaign,
  Issues,
} = require("../models");
const tokenGenerate = require("../libs/generateToken");
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
    console.log(token);

    // await sendOtp({ email: email, otpCode: itpCode });
    return res.json({
      message: "Login successful",
      token,
      error: false,
      profile: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
});

// Fetching All users
router.get("/users", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res
        .status(422)
        .send({ message: "Profile not found", error: true });
    }

    const users = await User.findAll();
    const usersWithCampaigns = await Promise.all(
      users.map(async (user) => {
        const campaignsCount = await Campaign.count({
          where: { user_id: user.id },
        });
        const reportCount = await Issues.count({
          where: { reporter: user.id },
        });
        return {
          ...user.toJSON(),
          campaignsCount,
          reportCount,
        };
      })
    );

    return res
      .status(200)
      .json({
        message: "Users Loaded Successfully",
        error: false,
        data: usersWithCampaigns,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error getting users", error: error.message });
  }
});

// Fetching All disaster tips
router.get("/all-disaster-tip", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res
        .status(422)
        .send({ message: "Profile not found", error: true });
    }
    const users = await DTips.findAll();
    return res
      .status(200)
      .json({
        message: "Disaster Tips Loaded Successfully",
        error: false,
        data: users,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error geting tips", error: error.message });
  }
});

// Fetching All Environment tips
router.get(
  "/all-environmental-tip",
  MobileAppAuthMiddleware,
  async (req, res) => {
    const { email } = req.user;
    try {
      const existingUser = await Admin.findOne({ where: { email } });

      if (!existingUser) {
        return res
          .status(422)
          .send({ message: "Profile not found", error: true });
      }
      const users = await Tips.findAll();
      return res
        .status(200)
        .json({
          message: "Environmental Tips Loaded Successfully",
          error: false,
          data: users,
        });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error geting tips", error: error.message });
    }
  }
);

// Fetching All Campaigns
router.get("/all-campaigns", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res
        .status(422)
        .send({ message: "Profile not found", error: true });
    }
    const users = await Campaign.findAll();
    const usersWithCampaigns = await Promise.all(
      users.map(async (user) => {
        const campaignsCount = await User.findOne({
          where: { id: user.user_id },
        });
        return {
          ...user.toJSON(),
          fullname: campaignsCount.fullname,
        };
      })
    );
    return res
      .status(200)
      .json({
        message: "Campaigns Loaded Successfully",
        error: false,
        data: usersWithCampaigns,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error geting tips", error: error.message });
  }
});

// Fetching All Reports
router.get("/all-reports", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res
        .status(422)
        .send({ message: "Profile not found", error: true });
    }
    const users = await Issues.findAll();
    const usersWithCampaigns = await Promise.all(
      users.map(async (user) => {
        const campaignsCount = await User.findOne({
          where: { id: user.reporter },
        });
        return {
          ...user.toJSON(),
          fullname: campaignsCount.fullname,
        };
      })
    );
    return res
      .status(200)
      .json({
        message: "Reports Loaded Successfully",
        error: false,
        data: usersWithCampaigns,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error geting tips", error: error.message });
  }
});

// Dashboard endpoint
router.get("/dashboard", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res
        .status(422)
        .send({ message: "Profile not found", error: true });
    }
    const [users, campaigns, issues] = await Promise.all([
      User.findAll(),
      Campaign.findAll(),
      Issues.findAll(),
    ]);
    return res.status(200).json({
      message: "Welcome back Admin",
      error: false,
      data: {
        users: users.length,
        campaigns: campaigns.length,
        issues: issues.length,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error geting tips", error: error.message });
  }
});


module.exports = router;
