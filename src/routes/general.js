const express = require("express");
const { User, Tips } = require("../models");
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


module.exports = router;
