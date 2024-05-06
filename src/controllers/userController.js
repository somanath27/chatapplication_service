const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../database/generateToken");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");

module.exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already Exist");
    }
    const hasedPassword = await bcryptjs.hash(password, 12);
    const user = await User.create({
        name,
        email,
        password: hasedPassword,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

module.exports.authUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: "Validation Failed", errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(401).json({ message: "User does not exist" });
    }

    const isEqual = await bcryptjs.compare(password, user.password);
    if (!isEqual) {
        return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
        message: "User logged in successfully",
        token: generateToken(user._id),
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
    });
});

// api/user?search=somanath
module.exports.allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
              $or: [
                  { name: { $regex: req.query.search, $options: "i" } },
                  { email: { $regex: req.query.search, $options: "i" } },
              ],
          }
        : {};
    const users = await User.find(keyword);
    res.send(users);
});
