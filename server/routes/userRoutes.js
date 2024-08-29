const express = require('express');
const router = express.Router();
const User = require('../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
require('dotenv').config({ path: '../.env' });

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        console.log(user);
        if(user){
            console.log("register");
            console.log('User already exists');
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        req.body.password = hash;
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'User registration failed, please try again'
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email:email });
        console.log(user);
        if(!user){
            console.log("login");
            return res.status(404).json({
                success: false,
                message: 'User not found, Register to continue'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: 'Invalid Password'
            });
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET );
        
        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            authToken:token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'User login failed, please try again'
        });
    }
});

router.get('/profile',authMiddleware, async (req, res) => {   
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email: email}).select('-password');
        console.log(user);
        // if (!user) {
        //     console.log("profile");
        //     return res.status(404).json({
        //         success: false,
        //         message: 'User not found'
        //     });
        // }
        return res.status(200).json({
            success: true,
            user: user,
            message: 'User profile fetched successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'User profile fetch failed, please try again'
        });
    }
});

module.exports = router;