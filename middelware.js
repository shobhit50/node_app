const jwt = require('jsonwebtoken');




const verifyToken = (req, res, next) => {
    const token = req.cookies['token'];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

module.exports = verifyToken;