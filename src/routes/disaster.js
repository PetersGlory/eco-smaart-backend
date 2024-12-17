const express = require("express");
const MobileAppAuthMiddleware = require("../middleware/userMiddleware");
const { User, Issues } = require("../models");
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
        img_url: "http://192.168.0.108:8095/uploads/" + req.file.filename,
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

module.exports = router;
