const jwt = require("jsonwebtoken");
const userkey = process.env.ACCESS_TOKEN_SECRET_TEXT;


const MobileAppAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers["x-access-token"] || req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(authHeader)

    if (token == null || token == "" || token == undefined) {
        return res.status(401).json({ error: true, message: "You're Logged Out, please login", authHead: req.headers, loggedOut: true });
    } else {

        jwt.verify(token, userkey, (err, user) => {
            if (err) return res.status(403).json({ error: true, message: "Token invalid" });

            req.user = user;
            // console.log(req.email);
            next();
        })
    }
}


module.exports = MobileAppAuthMiddleware;
