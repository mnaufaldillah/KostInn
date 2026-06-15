const { where } = require('sequelize');
const { User, Profile } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const cloudinary = require('cloudinary').v2;

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
                address,
                status: 'pending'
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
                throw { name: 'CredentialsRequired', message: 'Email is required' };
            }

            if (!password) {
                throw { name: 'CredentialsRequired', message: 'Password is required' };
            }   

            const user = await User.findOne({ 
                where: { 
                    email 
                } 
            });

            if (!user) {
                throw { name: 'Unauthorized', message: 'Invalid email or password' };
            }

            const isMatch = comparePassword(password, user.password);

            if (!isMatch) {
                throw { name: 'Unauthorized', message: 'Invalid email or password' };
            }

            const token = signToken({ id: user.id, email: user.email });

            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }

    static async uploadIDCard(req, res, next) {
        try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            const b64file = Buffer.from(req.file.buffer).toString('base64');
        
            const dataURI = `data:${req.file.mimetype};base64,${b64file}`;

            const uploadFile = await cloudinary.uploader.upload(dataURI, {
                folder: 'kostinn-idcards',
                public_id: `idcard_${Date.now()}`,
            });

            const editedUser = await User.update(
                { IDCardUrl: uploadFile.secure_url },
                { where: { id: req.UserId }, returning: true }
            );

            const uploadedIDCardUrl = editedUser[1][0].IDCardUrl;

            res.status(200).json({ message: 'ID Card uploaded successfully', IDCardUrl: uploadedIDCardUrl });
        } catch (error) {
            next(error);
        }
    }

    static async getIDCard(req, res, next) {
        try {
            const user = await User.findByPk(req.UserId);

            if (!user) {
                throw { name: 'NotFound', message: 'User not found' };
            }

            res.status(200).json({ IDCardUrl: user.IDCardUrl });
        } catch (error) {
            next(error);
        }
    }

    static async validateIDCard(req, res, next) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);

            if (!user) {
                throw { name: 'NotFound', message: 'User not found' };
            }

            if (!user.IDCardUrl) {
                throw { name: 'NotFound', message: 'ID Card not found' };
            }
            
            const profile = await Profile.findOne({ where: { UserId: id } });

            if (!profile) {
                throw { name: 'NotFound', message: 'Profile not found' };
            }

            profile.status = 'active';

            await profile.save();

            res.status(200).json({ message: 'ID Card validated successfully', IDCardUrl: user.IDCardUrl });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;