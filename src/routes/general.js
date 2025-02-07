const express = require("express");
const { User, Tips, DTips, ContactUs, News } = require("../models");
const MobileAppAuthMiddleware = require("../middleware/userMiddleware");

const router = express.Router();

// Registration Endpoint
router.get("/environmental-tips", MobileAppAuthMiddleware, async (req, res) => {
    const {email} = req.user;
    try {
        const existingUser = await User.findOne({where:{email}});

        if(!existingUser){
            return res.status(422).send({ message: "Profile not found", error: true });
        }
        const environmentTips = await Tips.findAll({where: {type: 'environmental'}});
        return res.status(200).json({ message: "Environmental Tips Fetched Successfully", error: false, data: environmentTips });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error geting tips", error: error.message });
    }
});


router.get("/disaster-tips", MobileAppAuthMiddleware, async (req, res) => {
    const {email} = req.user;
    try {
        const existingUser = await User.findOne({where:{email}});

        if(!existingUser){
            return res.status(422).send({ message: "Profile not found", error: true });
        }
        const environmentTips = await DTips.findAll();
        return res.status(200).json({ message: "Environmental Tips Fetched Successfully", error: false, data: environmentTips });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error geting tips", error: error.message });
    }
});

// Contact section
router.post("/contact", MobileAppAuthMiddleware,async (req, res) => {
    const {email} = req.user;
    const {message} = req.body;
    console.log(req.user)
    if(!message){
        return res.status(422).send({ message: "All fields are required.", error: true });
    }
    try{

        const existingUser = await User.findOne({where:{email}});

        if(!existingUser){
            return res.status(422).send({ message: "Profile not found", error: true });
        }

        await ContactUs.create({
            user_id: existingUser.id,
            fullname: existingUser.fullname,
            email: existingUser.email,
            message: message
        });
        return res.status(200).json({ message: "Message submitted successfully", error: false });
    }catch(err){
      console.error('err ', err);
      return res.status(500).json({ message: "Error geting tips", error: err.message });
    }
})



router.get("/news", MobileAppAuthMiddleware, async (req, res) => {
    const {email} = req.user;
    try {
        const existingUser = await User.findOne({where:{email}});

        if(!existingUser){
            return res.status(422).send({ message: "Profile not found", error: true });
        }
        const environmentTips = await News.findAll();
        return res.status(200).json({ message: "News Fetched Successfully", error: false, data: environmentTips });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error geting tips", error: error.message });
    }
});


module.exports = router;
