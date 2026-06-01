const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

const signToken = (payload) => {
    const token = jwt.sign(payload, secretKey);

    return token;
};

const verifyToken = (token) => {
    const decoded = jwt.verify(token, secretKey);

    return decoded;
};

module.exports = {
    signToken,
    verifyToken
};