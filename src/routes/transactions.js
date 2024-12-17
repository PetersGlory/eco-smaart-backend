const express = require("express");
const { User, Transaction } = require("../models");
const MobileAppAuthMiddleware = require("../middleware/userMiddleware");

const router = express.Router();

// Registration Endpoint
router.get("/transactions", MobileAppAuthMiddleware, async (req, res) => {
    const email = req.user;
    try {
        const existingUser = await User.findOne({where:{email}});

        if(!existingUser){
            return res.status(422).send({ message: "Profile not found", error: true });
        }
        const transactions = await Transaction.findAll({where: {user_id: existingUser.id}});
        return res.status(200).json({ message: "User created successfully", error: false, data: transactions });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
});


module.exports = router;
