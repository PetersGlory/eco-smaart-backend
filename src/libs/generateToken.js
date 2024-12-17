const jwt = require("jsonwebtoken");
const key = process.env.ACCESS_TOKEN_SECRET_TEXT;


tokenGenerate = ({ email }) => {
    return jwt.sign({ email }, key, {
        expiresIn: '7d'
    });
}


module.exports = tokenGenerate;