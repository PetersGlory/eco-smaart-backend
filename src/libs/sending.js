const nodemailer = require('nodemailer');

const sending = nodemailer.createTransport({
    host: 'oga4bill.com',//'premium297.web-hosting.com',
    port: 465,
    secure: true,
    auth: {
        user: 'support@oga4bill.com',
        pass: 'support@oga4bill',
    }
});


module.exports = sending