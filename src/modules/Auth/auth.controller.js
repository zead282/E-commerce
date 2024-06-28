import usermodel from '../../../DB/Models/user.model.js';
import jwt from 'jsonwebtoken';
import sendEmailService from "../../services/send-email.service.js"
import bcrypt from 'bcryptjs';
export const signup=async(req,res,next)=>{
    const {
        username,
        email,
        password,
        age,
        role,
        phoneNumbers,
        addresses,
    } = req.body

    const isemailexist=await usermodel.findOne({email});
    if(isemailexist) return next(new Error("email already exist"));
    const usertoken=jwt.sign({email},process.env.JWT_SECRET_VERFICATION, { expiresIn: '2m' });

    const isemailsent=await sendEmailService({
        to:email,
        subject:"Email Verification",
        message:`<h1>Please click on the link to verify your email</h1>
        <a href="http://localhost:3000/auth/verify-email?token=${usertoken}">Verify Email</a>`

    })
    if(!isemailsent) return next(new Error('Email is not sent, please try again later', { cause: 500 }));

    const hashpassword=bcrypt.hashSync(password,+process.env.SALT_ROUNDS);
    const newuser=await usermodel.create({username,password:hashpassword,age,role,addresses,phoneNumbers,email});
    if(!newuser) return next(new Error('Something went wrong, please try again later', { cause: 500 }));
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newuser
    })
}

export const verifyEmail = async (req, res, next) => {
    const { token } = req.query
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_VERFICATION)
    // get uset by email , isEmailVerified = false
    const user = await usermodel.findOneAndUpdate({
        email: decodedData.email, isEmailVerified: false
    }, { isEmailVerified: true }, { new: true })
    if (!user) {
        return next(new Error('User not found', { cause: 404 }))
    }

    res.status(200).json({
        success: true,
        message: 'Email verified successfully, please try to login'
    })
}

export const signin=async (req, res, next) => {

    const{email,password}=req.body;

    const user=await usermodel.findOne({email});
    if(!user) return next(new Error('User not found', { cause: 404 }));
    if(!user.isEmailVerified) return next(new Error('Email is not verified', { cause: 401 }));
    const ispasswordmatch=bcrypt.compareSync(password,user.password);
    if(!ispasswordmatch) return next(new Error('Invalid password', { cause: 401 }));

    const accesstoken=jwt.sign({email, id: user._id, loggedIn: true},process.env.JWT_SECRET_LOGIN, { expiresIn: '1d' });

    user.isLoggedIn = true
    await user.save()
    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: accesstoken
    })
}

