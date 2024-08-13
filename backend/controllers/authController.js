import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Credit from "../models/Credit.js";

export const signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        const newCredit = new Credit({
            user: newUser._id,
            count: 3,
            plan: 'Free',
            subscriptionStatus: 'active'
          });
        await newCredit.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // only use secure in production
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          });
        console.log('Login successful, sending access token:', accessToken.substring(0, 10) + '...');
        res.json({ accessToken, user: { userId: user._id, username: user.username } });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

export const refreshAccessToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const newAccessToken = jwt.sign({ userId: user.userId , username: user.username}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: newAccessToken, userId: user.userId , username: user.username });
    });
};

export const validateToken = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        // Here you could fetch the user data if needed
        res.json({ valid: true, user: { userId: user.userId , username: user.username } });
    });
};

export const changePassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};