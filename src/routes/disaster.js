const express = require("express");
const MobileAppAuthMiddleware = require("../middleware/userMiddleware");
const { User, Issues, Campaign } = require("../models");
const uploadPics = require("../libs/uploadPics");

const router = express.Router();

function generateFourDigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

router.post(
  "/report-issue",
  MobileAppAuthMiddleware,
  uploadPics.single("image_pics"),
  async (req, res) => {
    const {email} = req.user;
    const { issueType, description } = req.body;

    
    try {
        const existingUser = await User.findOne({ where: { email } });
        const reference = "eco-" + generateFourDigitNumber() + "-report";
        console.log(reference)

      if (!existingUser) {
        return res.status(422).send({ message: "User not found", error: true });
      }
      await Issues.create({
        reference,
        type:issueType,
        reporter: existingUser.id,
        description,
        img_url: "https://eco-smaart-backend.onrender.com/uploads/" + req.file.filename,
      });

      return res.status(200).json({
          message: "Report Submitted Successfully",
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

router.post(
  "/start-campaign",
  MobileAppAuthMiddleware,
  uploadPics.single("campaign_pics"),
  async (req, res) => {
    const {email} = req.user;
    const { title, duration, goal, description } = req.body;

    
    try {
        const existingUser = await User.findOne({ where: { email } });
        const reference = "eco-" + generateFourDigitNumber() + "-campaign";
        console.log(reference)

      if (!existingUser) {
        return res.status(422).send({ message: "User not found", error: true });
      }
      await Campaign.create({
        reference,
        title,
        goal,
        duration,
        user_id: existingUser.id,
        description,
        img_url: "https://eco-smaart-backend.onrender.com/uploads/" + req.file.filename,
      });

      return res.status(200).json({
          message: "Campaign Submitted Successfully",
          error: false,
          success: true,
        });
    } catch (err) {
      console.error("err ", err);
      return res
        .status(500)
        .json({ message: "Error submitting campaign", error: err.message });
    }
  }
);

router.get("/campaign", MobileAppAuthMiddleware, async (req, res) => {
  const {email} = req.user;
  try {
    const existingUser = await User.findOne({where:{email}});

    if(!existingUser){
        return res.status(422).send({ message: "Profile not found", error: true });
    }
    const allCampaign = await Campaign.findAll();
    return res.status(200).json({
      message: "Campaign fetched successfully",
      data: allCampaign
    })
  }catch{
    console.log(error);
    return res.status(500).json({ message: "Error creating user", error: error.message });
  }
})

module.exports = router;
