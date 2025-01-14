const express = require("express");
const { User, Notification } = require("../models");
const MobileAppAuthMiddleware = require("../middleware/userMiddleware");
const { Sequelize } = require("sequelize");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const uploader = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Getting profile Endpoint
router.get("/profile", MobileAppAuthMiddleware, async (req, res) => {
    const {email} = req.user;
    try {
        const existingUser = await User.findOne({where:{email}});

        if(!existingUser){
            return res.status(422).send({ message: "Profile not found", error: true });
        }
        return res.status(200).json({ message: "User created successfully", success: true, data: existingUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// Registration Endpoint
router.post("/profile", MobileAppAuthMiddleware, async (req, res) => {
    const {email} = req.user;
    const {fullname, phone, country, city} = req.body;
    try {
        const existingUser = await User.findOne({where:{email}});

        if(!existingUser){
            return res.status(422).send({ message: "Profile not found", error: true });
        }
        
        await User.update({
            fullname: fullname,
            phone: phone,
            country: country,
            city: city,
        }, {where: {email: email}});
        return res.status(200).json({ message: "User updated successfully", error: false });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// Uploading Profile Pics
router.post("/profile-pics", MobileAppAuthMiddleware, 
    uploader.single("image_pics"), async (req, res) => {
    const {email} = req.user;
    try {
        const existingUser = await User.findOne({where:{email}});

        if(!existingUser){
            return res.status(422).send({ message: "Profile not found", error: true });
        }

        const result = await cloudinary.uploader.upload_stream(req.file.buffer);
        const imgUrl = result.secure_url;
        
        await User.update({
            profile_pics: imgUrl,
        }, {where: {email: email}});
        return res.status(200).json({ message: "User profile picture updated successfully", error: false });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating profile picture", error: error.message });
    }
});

// getting Notifications
router.get("/notifications", MobileAppAuthMiddleware, async (req, res)=>{
    const {email} = req.user;

    try {
        const notifications = await Notification.findAll({where: Sequelize.or(
           { for_email: email},
           {for_email: "all"}
        )});

        return res.status(200).json({message: "Notification section", data: notifications, success: true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error", error: error.message });
    }
})


module.exports = router;
