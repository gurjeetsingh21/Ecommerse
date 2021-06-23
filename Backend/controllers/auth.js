const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const _ = require("lodash");
sgMail.setApiKey(process.env.EMAIL_API_KEY);

exports.signup = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.json({
        systemMessage: errorHandler(err),
        systemMessageType: "error",
        user: {},
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      systemMessage: "",
      systemMessageType: "success",
      user: user,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.json({
        systemMessage: "User with that email does not exist. Please signup",
        systemMessageType: "error",
        user: {},
      });
    }
    if (!user.authenticate(password)) {
      return res.json({
        systemMessage: "Email and password do not match",
        systemMessageType: "error",
        user: {},
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });
    const { _id, name, email, role, history } = user;
    return res.json({
      systemMessage: "",
      systemMessageType: "success",
      user: { token, _id, email, name, role, history },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ systemMessage: "SignOut Success", systemMessageType: "success" });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        systemMessage: "User with that email does not exist",
        systemMessageType: "error",
        user: {},
      });
    }
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );
    console.log(token);
    console.log(process.env.EMAIL_FROM);
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset link`,
      html: `
          
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email </title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                   
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
					
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                
								<tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Forgot Your Password?
                                         </h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            No worries!
											<br>
											To reset your password, click the button below
                                        </p>
                                        <a href=${process.env.CLIENT_URL}/auth/password/reset/${token}
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a><br><br><br><br>
										<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">*This link is valid for 10 minutes*</p>
										<br>
										<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">If you haven't asked for a change in your password, don't worry. Your password is still safe.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;"><strong>Warm Regards,</strong> <br><br> <strong>Team Book Your Books</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>
      `,
    };
    return user.updateOne({ reset_password_link: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR", err);
        return res.status(400).json({
          systemMessage:
            "Database connection error on user password forgot request",
          systemMessageType: "error",
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            // console.log('SIGNUP EMAIL SENT', sent)
            return res.json({
              systemMessage: `Email has been sent to ${email}. Follow the instruction to activate your account`,
              systemMessageType: "success",
            });
          })
          .catch((err) => {
            return res.json({
              systemMessage: err.response.body,
              systemMessageType: "error",
            });
          });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { reset_password_link, password } = req.body;

  if (reset_password_link) {
    jwt.verify(
      reset_password_link,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            systemMessage: "Expired link. Try again",
            systemMessageType: "error",
          });
        }

        User.findOne({ reset_password_link }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              systemMessage: "Something went wrong. Try later",
              systemMessageType: "error",
            });
          }

          const updatedFields = {
            hashed_password: user.encryptPassword(password),
            reset_password_link: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                systemMessage: "Error resetting user password",
                systemMessageType: "error",
              });
            }
            res.json({
              systemMessage: `Great! Now you can login with your new password`,
              systemMessageType: "success",
            });
          });
        });
      }
    );
  }
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(200).json({
      systemMessage: "Access Denied.",
      systemMessageType: "error",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(200).json({
      systemMessage: "Admin Resourse! You are not admin",
      systemMessageType: "error",
    });
  }
  next();
};
