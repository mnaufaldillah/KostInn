const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

async function authentication(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw { name: 'Unauthenticated' };
        }

        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw { name: 'Unauthenticated' };
        }

        req.UserId = user.id;
        
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authentication;