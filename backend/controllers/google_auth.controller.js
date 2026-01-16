import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    const { credential } = req.body; // ID token from Google

    if (!credential) {
        return res.status(400).json({ message: 'Missing Google credential' });
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, given_name, family_name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
        // Create user if new
        user = await User.create({
            displayName: name,
            firstName: given_name,
            lastName: family_name,
            email,
            userImage: picture,
            googleId,
            authProvider: 'google'
        });
    }

    // Generate your own JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user, message: 'Logged in with Google' });
};
