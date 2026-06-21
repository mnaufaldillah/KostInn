const { where } = require('sequelize');
const { User, Profile, HistoryKost, RoomKost } = require('../models');
const { comparePassword, hashPassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { generateOTP } = require('../helpers/otp');
const { sendOTPEmail, sendResetEmail } = require('../helpers/mailer');
const cloudinary = require('../helpers/cloudinary');

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

class UserController {
    static async register(req, res, next) {
        try {
            const { email, password, fullname, contactphone, address, role } = req.body;

            const otp = generateOTP();

            const newUser = await User.create({
                email,
                password,
                otpCode: hashPassword(otp),
                otpExpires: new Date(Date.now() + OTP_TTL_MS)
            });

            await Profile.create({
                UserId: newUser.id,
                fullname,
                contactPhone: contactphone,
                address,
                role,
                status: 'pending'
            });

            // ponytail: fire-and-forget send; failure surfaces at verify, not registration
            sendOTPEmail(newUser.email, otp).catch((err) => console.error('OTP email failed:', err.message));

            res.status(201).json({ id: newUser.id, email: newUser.email, message: 'OTP sent to your email' });
        } catch (error) {
            next(error);
        }
    }

    static async verifyOTP(req, res, next) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                throw { name: 'CredentialsRequired', message: 'Email and OTP are required' };
            }

            const user = await User.findOne({ where: { email } });

            if (!user || !user.otpCode || !user.otpExpires) {
                throw { name: 'BadRequest', message: 'No pending OTP for this email' };
            }

            if (user.otpExpires < new Date()) {
                throw { name: 'BadRequest', message: 'OTP has expired' };
            }

            if (!comparePassword(otp, user.otpCode)) {
                throw { name: 'Unauthorized', message: 'Invalid OTP' };
            }

            // ponytail: clear OTP by direct update to skip beforeSave/hooks (otpCode is not a password)
            await user.update({ otpCode: null, otpExpires: null });

            const token = signToken({ id: user.id, email: user.email });

            res.status(200).json({ message: 'Email verified', token, IDCardUrl: user.IDCardUrl });
        } catch (error) {
            next(error);
        }
    }

    static async requestPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

            if (!email) {
                throw { name: 'CredentialsRequired', message: 'Email is required' };
            }

            const user = await User.findOne({ where: { email } });

            if (user) {
                // ponytail: short-lived signed JWT as the reset credential (15m); no DB token store needed
                const resetToken = signToken({ id: user.id, email: user.email, purpose: 'reset' }, { expiresIn: '15m', algorithm: 'HS256' });
                const link = `${clientUrl}/reset-password?token=${resetToken}`;
                await sendResetEmail(user.email, link);
            }

            // ponytail: same response whether or not the email exists — no user enumeration
            res.status(200).json({ message: 'If that email exists, a reset link has been sent' });
        } catch (error) {
            next(error);
        }
    }

    static async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;

            if (!token || !password) {
                throw { name: 'CredentialsRequired', message: 'Token and new password are required' };
            }

            let payload;
            try {
                payload = verifyToken(token);
            } catch (err) {
                // ponytail: distinguish expired (ask for a new link) from malformed/invalid
                const expired = err.name === 'TokenExpiredError';
                throw { name: 'Unauthorized', message: expired ? 'Reset link has expired, please request a new one' : 'Invalid reset link' };
            }

            if (payload.purpose !== 'reset') {
                throw { name: 'Unauthorized', message: 'Invalid reset link' };
            }

            const user = await User.findByPk(payload.id);
            if (!user) {
                throw { name: 'NotFound', message: 'User not found' };
            }

            // ponytail: direct update to hash via field assignment; beforeSave hook re-hashes
            user.password = password;
            await user.save();

            res.status(200).json({ message: 'Password reset successfully' });
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

            res.status(200).json({ token, IDCardUrl: user.IDCardUrl });
        } catch (error) {
            next(error);
        }
    }

    static async uploadIDCard(req, res, next) {
        try {
            if (!req.file) {
                throw { name: 'BadRequest', message: 'ID Card file is required' };
            }

            const b64file = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64file}`;

            const uploadFile = await cloudinary.uploader.upload(dataURI, {
                folder: 'kostinn-idcards',
                public_id: `idcard_${req.UserId}_${Date.now()}`,
                resource_type: 'auto' // ponytail: auto so PDFs upload as raw/image correctly
            });

            const user = await User.findByPk(req.UserId);
            user.IDCardUrl = uploadFile.secure_url;
            await user.save();

            res.status(200).json({ message: 'ID Card uploaded successfully', IDCardUrl: user.IDCardUrl });
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

    static async me(req, res, next) {
        try {
            const user = await User.findByPk(req.UserId, {
                include: { model: Profile }
            });

            if (!user) {
                throw { name: 'NotFound', message: 'User not found' };
            }

            res.status(200).json({
                id: user.id,
                email: user.email,
                IDCardUrl: user.IDCardUrl,
                role: user.Profile?.role || 'Pencari Kost',
                ProfileId: user.Profile?.id,
                fullname: user.Profile?.fullname,
                contactPhone: user.Profile?.contactPhone,
                address: user.Profile?.address,
                status: user.Profile?.status,
                updatedAt: user.Profile?.updatedAt
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateMe(req, res, next) {
        try {
            const { fullname, contactPhone, address } = req.body;

            const user = await User.findByPk(req.UserId, {
                include: { model: Profile }
            });

            if (!user || !user.Profile) {
                throw { name: 'NotFound', message: 'Profile not found' };
            }

            user.Profile.fullname = fullname ?? user.Profile.fullname;
            user.Profile.contactPhone = contactPhone ?? user.Profile.contactPhone;
            user.Profile.address = address ?? user.Profile.address;
            await user.Profile.save();

            res.status(200).json({
                id: user.id,
                email: user.email,
                role: user.Profile.role,
                fullname: user.Profile.fullname,
                contactPhone: user.Profile.contactPhone,
                address: user.Profile.address
            });
        } catch (error) {
            next(error);
        }
    }

    static async myHistory(req, res, next) {
        try {
            const profile = await Profile.findOne({ where: { UserId: req.UserId } });

            if (!profile) {
                return res.status(200).json([]);
            }

            const history = await HistoryKost.findAll({
                where: { ProfileId: profile.id },
                include: { model: RoomKost },
                order: [['startDate', 'DESC']]
            });

            res.status(200).json(history);
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