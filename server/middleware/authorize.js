const { User, Profile } = require('../models');

// ponytail: admin-only guard; fetches the profile role of the authenticated user
async function adminOnly(req, res, next) {
    try {
        const profile = await Profile.findOne({ where: { UserId: req.UserId } });
        if (!profile || profile.role !== 'Admin') {
            throw { name: 'Forbidden' };
        }
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = adminOnly;
