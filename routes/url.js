const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const validUrl = require('valid-url');
const shortId = require('shortid');
const Url = require('../models/urlSchema');
const router = express.Router();

router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const baseUrl = 'http://localhost:3000';

    console.log('Received URL to shorten:', originalUrl, "--", baseUrl);

    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL');
    }
    if (validUrl.isUri(originalUrl)) {
        try {
            let url = await Url.findOne({ originalUrl, user: req.userId });
            if (url) {
                res.json(url);
            } else {
                // Generate a base64 encoded string as shortUrl
                const shortUrl = shortId.generate();
                // const shortUrl = crypto.randomBytes(6).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                url = new Url({
                    originalUrl,
                    shortUrl,
                    date: new Date(),
                    // user: req.userId
                });
                await url.save();
                // await User.findByIdAndUpdate(req.userId, { $push: { urls: url._id } });
                const url1 = baseUrl + '/' + shortUrl;
                res.render('index', { url1 });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    } else {
        res.status(401).json('Invalid original URL');
    }
});

router.get('/:shortUrl', async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });
        if (url) {
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

module.exports = router;