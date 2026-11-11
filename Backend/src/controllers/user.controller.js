import userModel from "../models/user.model.js";
import crypto from "crypto"; //it is inbuild package in our node
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../Services/email.services.js";
import { generateOtp, getOtpHtml } from "../utils/util.js";
import otpModel from "../models/otp.model.js";

export async function userRegister(req, res) {
  const { username, email, password } = req.body;

  const checkUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (checkUser) {
    return res
      .status(409)
      .json({ message: "Username or email already existing !" });
  }

  const hashPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const user = await userModel.create({
    username,
    email,
    password: hashPassword,
  });

  const otp = generateOtp(); //generate the otp
  const html = getOtpHtml(otp);

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await otpModel.create({
    email,
    user: user.id,
    otpHash,
  });

  await sendEmail(email, "OTP verificaiton", `your OTP code is ${otp}`, html);

  return res.status(201).json({
    message: "User created Successfully",
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}

export async function Login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invaild email or password" });
  }

  if (!user.verified) {
    return res.status(401).json({ message: "Email not verified! " });
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const isValidPassword = hashedPassword === user.password;
  if (!isValidPassword) {
    return res.status(401).json({ message: "Wrong Password!" });
  }

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRECT,
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    config.JWT_SECRECT,
    {
      expiresIn: "15m",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 100, //7d
  });

  res.status(200).json({
    message: "Logged in Successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
}

export async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh Token not found!",
    });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRECT);

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRECT,
    {
      expiresIn: "15m",
    },
  );

  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRECT,
    {
      expiresIn: "7d",
    },
  );

  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7d
  });

  res
    .status(201)
    .json({ message: "Access Token is refresh Successfully!", accessToken });
}

export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token not found!" });
  }
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }

  session.revoked = true;
  await session.save();

  res.clearCookie("refreshToken");

  res.status(200).json({ message: "User LogOut Successfully!" });
}

export async function logoutall(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token not found!" });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRECT);

  await sessionModel.updateMany(
    {
      user: decoded.id,
      revoked: false,
    },
    {
      revoked: true,
    },
  );
  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "Logged Out Successfully from all devices",
  });
}



export async function verifyEmail(req, res) {
  const { otp, email } = req.body;

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const otpDoc = await otpModel.findOne({
    email,
    otpHash,
  });

  if (!otpDoc) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  const user = await userModel.findByIdAndUpdate(otpDoc.user, {
    verified: true,
  });

  await otpModel.deleteMany({

    user: otpDoc.user,
  });

  return res.status(200).json({
    message: "Email verified successfully",
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}

export async function forgetPass(req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email not found!" });
  }

  //otp geneerate ke liye
  const otp = generateOtp();
  const html = getOtpHtml(otp);

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await otpModel.deleteMany({ user: user._id });
  await otpModel.create({
    email,
    otpHash,
    user: user._id,
  });

  await sendEmail(email, "OTP sended", ` your OTP is ${otp}`, html);

  res.status(200).json({
    message: "Password resent OTP sended in your Email Successfully",
  });
}

export async function updatePass(req, res) {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All field are required" });
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  const otpDoc = await otpModel.findOne({ email, otpHash });

  if (!otpDoc) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const hashPassword = crypto
    .createHash("sha256")
    .update(newPassword)
    .digest("hex");

  await userModel.findByIdAndUpdate(otpDoc.user, {
    password: hashPassword,
  });

  await sessionModel.updateMany(
    { user: otpDoc.user, revoked: false },
    { revoked: true },
  );

  await otpModel.deleteMany({ user: otpDoc.user });

  return res.status(200).json({
    message:
      "Password has been reset successfully. Please login with your new password.",
  });
}
