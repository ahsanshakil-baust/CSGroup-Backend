const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");

const jwtSecret = process.env.JWT_SECRET;

const getAllUser = (req, res, next) => {
    User.getAllUser((data) => res.status(200).json({ data }));
};

const getUserByEmail = (req, res, next) => {
    const { email } = req.user;
    if (!email) {
        res.status(500).json({
            error: "Need To Pass Email.",
        });
    } else {
        User.getUserByEmail(email, (data) => {
            res.status(200).json(data);
        });
    }
};

const addUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    User.getAllUser(async (user) => {
        const existingUser = user.find((el) => el.email === email);

        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        if (!name || !email || !password) {
            res.status(500).json({
                error: "Need to fill all necessary fields.",
            });
        } else {
            const hashedPassword = await hashPassword(password);
            const user = new User(name, email, hashedPassword);
            user.save();

            res.status(201).json({
                msg: "User added successfully!",
            });
        }
    });
};

const userLogin = async (req, res, next) => {
    const { email, password } = req.body;

    User.getAllUser(async (user) => {
        const existingUser = user.find(
            (el) => el.email === email && el.status == 1
        );

        if (!existingUser) {
            return res.status(400).send("User not exists");
        }

        try {
            const isPasswordValid = await comparePassword(
                password,
                existingUser.password
            );

            if (isPasswordValid) {
                // Generate JWT token for successful login
                const token = jwt.sign(existingUser, jwtSecret, {
                    expiresIn: "1d",
                });
                res.json({
                    user: {
                        id: existingUser.id,
                        name: existingUser.name,
                        email: existingUser.email,
                    },
                    token,
                });
            } else {
                res.status(400).send("Invalid Credentials");
            }
        } catch (err) {
            res.status(500).send("Error logging in");
        }
    });
};

const checkLogin = (req, res, next) => {
    const { email } = req.user;

    if (email) res.send("1");
    else res.send("0");
};

module.exports = {
    getAllUser,
    getUserByEmail,
    addUser,
    userLogin,
    checkLogin,
};
