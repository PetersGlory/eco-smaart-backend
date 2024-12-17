

const sending = require("./sending");

const sendOtp = async ({ email, otpCode }) => {
    await sending.sendMail({
        from: "Eco Smart 👻 '<support@ecosmart.com>'",
        to: email,
        subject: 'Verification Code',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome Email</title>
            
        </head>
        
        <body style="width: 100% !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 5% !important;
        align-items: center !important;
        font-family: montserrat, Helvetica, sans-serif !important;
        color: white !important;
        text-align: center !important;">
            <div class="bg-dark" style="position: relative !important;
            background-color: #161616 !important;
            width: 70% !important;
            height: auto !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 5% !important;
            text-align: center !important;
            font-family: montserrat, Helvetica, sans-serif !important;
            color: white !important;">
        <img
            src="https://oga4bill.com/logo.png"
            width="100"
            alt="logo"
        />
        <br />
        <br />

        <span class="text" style="font-size: medium !important;
        line-height: 28px !important;">OGA4BILL</span>

        <br />
        <br />

        <h3 class="h1" style="line-height: 40px !important;
        text-transform: uppercase !important;">
            Hey there, ${email}
        </h3>

        <br />
        <hr style="width: 10% !important;
        font-weight: 800 !important;" />

        <br />
        <br />
        <p class="p-text" style="line-height: 25px !important;">
            Use the OTP beow to confirm your identity and reset your password. This OTP code will only be valid for 5 minutes
        </p>

        <br />
        <br />

        <h3 class="h1" style="line-height: 40px !important;
        text-transform: uppercase !important;">
            ${otpCode}
        </h3>

        <br />
        <br />
        <small class="p-text" style="line-height: 25px !important;">
            For any questions, feel free to get in touch.
        </small>
        <br />
        <br />

        <p style="font-size: 0.9em;">Best Regards,<br />OGA4BILL</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <div
            style="
            float: right;
            padding: 8px 0;
            color: #aaa;
            font-size: 0.8em;
            line-height: 1;
            font-weight: 300;
            "
        >
            <p>OGA4BILL</p>
        </div>
        </div>
    </body>
        </html>
        
        `,
    })
    // pool.query(`INSERT INTO otps(email,otpcode) VALUES('${email}','${otpCode}')`, async (err, results)=>{
    //     if(err){
    //         return res.status(400).json({
    //             error: true,
    //             message: "Unable to connect, refresh.",
    //             error: err.message
    //         });
    //     }else{
    //         await sending.sendMail({
    //             from: "OGA4BILL 👻 '<support@oga4bill.com>'",
    //             to: email,
    //             subject: 'Verification Code',
    //             html: `
    //             <!DOCTYPE html>
    //             <html lang="en">
    //             <head>
    //                 <meta charset="UTF-8" />
    //                 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    //                 <title>Welcome Email</title>
                    
    //             </head>
                
    //             <body style="width: 100% !important;
    //             height: 100vh !important;
    //             margin: 0 !important;
    //             padding: 5% !important;
    //             align-items: center !important;
    //             font-family: montserrat, Helvetica, sans-serif !important;
    //             color: white !important;
    //             text-align: center !important;">
    //                 <div class="bg-dark" style="position: relative !important;
    //                 background-color: #161616 !important;
    //                 width: 70% !important;
    //                 height: auto !important;
    //                 align-items: center !important;
    //                 justify-content: center !important;
    //                 padding: 5% !important;
    //                 text-align: center !important;
    //                 font-family: montserrat, Helvetica, sans-serif !important;
    //                 color: white !important;">
    //             <img
    //                 src="https://oga4bill.com/logo.png"
    //                 width="100"
    //                 alt="logo"
    //             />
    //             <br />
    //             <br />

    //             <span class="text" style="font-size: medium !important;
    //             line-height: 28px !important;">OGA4BILL</span>

    //             <br />
    //             <br />

    //             <h3 class="h1" style="line-height: 40px !important;
    //             text-transform: uppercase !important;">
    //                 Hey there, ${email}
    //             </h3>

    //             <br />
    //             <hr style="width: 10% !important;
    //             font-weight: 800 !important;" />

    //             <br />
    //             <br />
    //             <p class="p-text" style="line-height: 25px !important;">
    //                 Use the OTP beow to confirm your identity and reset your password. This OTP code will only be valid for 5 minutes
    //             </p>

    //             <br />
    //             <br />

    //             <h3 class="h1" style="line-height: 40px !important;
    //             text-transform: uppercase !important;">
    //                 ${otpCode}
    //             </h3>

    //             <br />
    //             <br />
    //             <small class="p-text" style="line-height: 25px !important;">
    //                 For any questions, feel free to get in touch.
    //             </small>
    //             <br />
    //             <br />

    //             <p style="font-size: 0.9em;">Best Regards,<br />OGA4BILL</p>
    //             <hr style="border: none; border-top: 1px solid #eee;" />
    //             <div
    //                 style="
    //                 float: right;
    //                 padding: 8px 0;
    //                 color: #aaa;
    //                 font-size: 0.8em;
    //                 line-height: 1;
    //                 font-weight: 300;
    //                 "
    //             >
    //                 <p>OGA4BILL</p>
    //             </div>
    //             </div>
    //         </body>
    //             </html>
                
    //             `,
    //         })
    //         // console.log(otpCode)
            
    //         // logins({data:{email:email}})
    //         return res.status(200).json({
    //             error: false,
    //             message: `A verification code has been sent to ${email}.`
    //         });
    //     }
    // })
}


module.exports = sendOtp;