const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const validUrl = require('valid-url');
const shortId = require('shortid');
const Url = require('../models/urlSchema');
const router = express.Router();

router.post('/shorten', async (req, res, next) => {
    const { originalUrl } = req.body;
    const baseUrl = 'http://localhost:3000';

    console.log('Received URL to shorten:', originalUrl, "--", baseUrl);

    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL');
    }
    if (validUrl.isUri(originalUrl)) {
        try {
            let urlData = await Url.findOne({ originalUrl, user: req.userId });
            if (urlData) {
                const baseurl2 = baseUrl + '/' + urlData.shortUrl;
                res.render('index', { urlData, baseurl2 });
            } else {
                // Generate a base64 encoded string as shortUrl
                const shortUrl = shortId.generate();
                console.log('Generated short URL:', shortUrl);
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
            const error = new Error('Server error');
            error.status = 500;
            next(err);
        }
    } else {
        const error = new Error('Invalid original URL');
        error.status = 400;
        next(error);
    }
});

router.get('/:shortUrl', async (req, res, next) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });
        if (url) {
            return res.redirect(url.originalUrl);
        } else {
            const error = new Error('Invalid original URL');
            error.status = 400;
            next(error);
        }
    } catch (err) {
        const error = new Error('Server error');
        error.status = 500;
        next(err);
    }
});

module.exports = router;