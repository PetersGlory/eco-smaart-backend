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
  News,
} = require("../models");
const tokenGenerate = require("../libs/generateToken");
const MobileAppAuthMiddleware = require("../middleware/userMiddleware");
const uploadPics = require("../libs/uploadPics");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
const saltRounds = 10;

function generateFourDigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // replace with your Cloudinary cloud name
  api_key: process.env.CLOUD_API_KEY,       // replace with your Cloudinary API key
  api_secret: process.env.CLOUD_SECRET_KEY   // replace with your Cloudinary API secret
});

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

// Uploading news
router.post(
  "/upload-news",
  MobileAppAuthMiddleware,
  uploadPics.single("image_pics"),
  async (req, res) => {
    const {email} = req.user;
    const { url_link, title, description } = req.body;

    
    try {
      const existingUser = await Admin.findOne({where:{email}});

      if(!existingUser){
          return res.status(422).send({ message: "Profile not found", error: true });
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      const imgUrl = result.secure_url; // Get the secure URL from the result
      await News.create({
        title,
        url_link: url_link ? url_link : "Eco-smart",
        short_desc: description,
        img_url: imgUrl || "https://eco-smaart-backend.onrender.com/uploads/" + req.file.filename,
      });

      return res.status(200).json({
          message: "News Uploaded Successfully",
          error: false,
          success: true,
        });
    } catch (err) {
      console.error("err ", err);
      return res
        .status(500)
        .json({ message: "Error submitting", error: err.message });
    }
  }
);

// Endpoint to add disaster tips
router.post("/add-disaster-tip", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  const { category, text } = req.body;

  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(422).send({ message: "Profile not found", error: true });
    }

    await DTips.create({
      category,
      text,
      type: "disaster"
    });

    return res.status(200).json({
      message: "Disaster Tip Added Successfully",
      error: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding disaster tip", error: error.message });
  }
});

// Endpoint to add environmental tips
router.post("/add-environmental-tip", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  const { category, text } = req.body;

  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(422).send({ message: "Profile not found", error: true });
    }

    await Tips.create({
      category,
      text,
      type: "environmental"
    });

    return res.status(200).json({
      message: "Environmental Tip Added Successfully",
      error: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding environmental tip", error: error.message });
  }
});

// Ban or Unban a user
router.post("/user-status", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  const { userId, action } = req.body;

  if (!userId || !["ban", "unban"].includes(action)) {
    return res.status(400).json({ message: "Invalid request", error: true });
  }

  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(422).send({ message: "Profile not found", error: true });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found", error: true });
    }

    user.status = action === "ban" ? "banned" : "active";
    await user.save();

    return res.status(200).json({
      message: `User ${action}ned successfully`,
      error: false,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating user status", error: error.message });
  }
});


// Delete a campaign by ID
router.delete("/campaign/:id", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  const { id } = req.params;

  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(422).send({ message: "Profile not found", error: true });
    }

    const campaign = await Campaign.findOne({ where: { id } });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found", error: true });
    }

    await campaign.destroy();

    return res.status(200).json({
      message: "Campaign deleted successfully",
      error: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting campaign", error: error.message });
  }
});

// Delete a report by ID
router.delete("/report/:id", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  const { id } = req.params;

  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(422).send({ message: "Profile not found", error: true });
    }

    const report = await Issues.findOne({ where: { id } });

    if (!report) {
      return res.status(404).json({ message: "Report not found", error: true });
    }

    await report.destroy();

    return res.status(200).json({
      message: "Report deleted successfully",
      error: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting report", error: error.message });
  }
});

// Delete a News by ID
router.delete("/news/:id", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  const { id } = req.params;

  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(422).send({ message: "Profile not found", error: true });
    }

    const report = await News.findOne({ where: { id } });

    if (!report) {
      return res.status(404).json({ message: "Report not found", error: true });
    }

    await report.destroy();

    return res.status(200).json({
      message: "News deleted successfully",
      error: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting report", error: error.message });
  }
});

// Delete an environmental tip by ID
router.delete("/environmental-tip/:id", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  const { id } = req.params;

  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(422).send({ message: "Profile not found", error: true });
    }

    const tip = await Tips.findOne({ where: { id } });

    if (!tip) {
      return res.status(404).json({ message: "Environmental tip not found", error: true });
    }

    await tip.destroy();

    return res.status(200).json({
      message: "Environmental tip deleted successfully",
      error: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting environmental tip", error: error.message });
  }
});

// Delete a disaster tip by ID
router.delete("/disaster-tip/:id", MobileAppAuthMiddleware, async (req, res) => {
  const { email } = req.user;
  const { id } = req.params;

  try {
    const existingUser = await Admin.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(422).send({ message: "Profile not found", error: true });
    }

    const tip = await DTips.findOne({ where: { id } });

    if (!tip) {
      return res.status(404).json({ message: "Disaster tip not found", error: true });
    }

    await tip.destroy();

    return res.status(200).json({
      message: "Disaster tip deleted successfully",
      error: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting disaster tip", error: error.message });
  }
});

module.exports = router;
