const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middelware');







// User registration endpoint
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    try {
        await user.save();
        res.status(201).send('User created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering new user');
    }
});

// User login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.status(200).send('Token stored in cookie');
});



router.post('/logout', verifyToken, (req, res) => {

    res.status(200).send({ message: 'Logged out successfully. Please clear your token.' });
});



module.exports = router;