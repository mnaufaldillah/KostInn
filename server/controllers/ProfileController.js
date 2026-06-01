const { Profile } = require('../models');

class ProfileController {
    static async getProfile(req, res, next) {
        try {
            const profiles = await Profile.findAll();

            res.status(200).json(profiles);
        } catch (error) {
            next(error);
        }
    }

    static async getProfileById(req, res, next) {
        try {
            const { id } = req.params;
            const profile = await Profile.findByPk(id);

            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }

            res.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    }

    static async updateProfile(req, res, next) {
        try {
            const { id } = req.params;
            const { fullname, contactPhone, address, isVerified, status } = req.body;

            const profile = await Profile.findByPk(id);

            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            } 

            profile.fullname = fullname || profile.fullname;
            profile.contactPhone = contactPhone || profile.contactPhone;
            profile.address = address || profile.address;

            await profile.save();

            res.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProfileController;