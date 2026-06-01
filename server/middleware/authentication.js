const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

const authentication = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new Error('Authorization header is required');
        }

        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token);

        const user = User.findByPk(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        req.UserId = user.id;
        
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authentication;