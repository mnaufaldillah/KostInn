const { where } = require('sequelize');
const { User, Profile } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

class UserController {
    static async register(req, res, next) {
        try {
            const { email, password, fullname, contactphone, address } = req.body;

            const newUser = await User.create({ 
                email, 
                password 
            });

            const newProfile = await Profile.create({
                UserId: newUser.id,
                fullname,
                contactPhone: contactphone,
                address
            });

            res.status(201).json({ id: newUser.id, email: newUser.email, profile: newProfile });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email) {
                throw new Error('Email is required');
            }

            if (!password) {
                throw new Error('Password is required');
            }   

            const user = await User.findOne({ 
                where: { 
                    email 
                } 
            });

            if (!user) {
                throw new Error('Invalid email or password');
            }

            const isMatch = comparePassword(password, user.password);

            if (!isMatch) {
                throw new Error('Invalid email or password');
            }

            const token = signToken({ id: user.id, email: user.email });

            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;