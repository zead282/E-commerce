import userModel from "../../../DB/Models/user.model.js";
import { generateOTP } from "../../utils/generate-otp.js";
import sendEmailService from'../../services/send-email.service.js';
import bcrypt from 'bcryptjs';
export const deleteaccount=async(req,res,next)=>{
    const{_id}=req.authUser;

    const finduser=await userModel.findByIdAndDelete(_id);

    if(!finduser) return next(new Error("somthing wrong"));

    res.status(200).json("deleted success");
}


export const updateuser=async(req,res,next)=>{

    const{username,email,age,addresses,phoneNumbers}=req.body;
    const{_id}=req.authUser;

    const isemailexist=await userModel.findOne({email});
    if(isemailexist) return next(new Error("email already exist"));
   
    const updateuser=await userModel.findByIdAndUpdate({_id},{username,email,age,addresses,phoneNumbers},{new:true})

    if(!updateuser) return next(new Error("wrong to update"));

    res.status(200).json("user updated succesfully");
    
}


export const forgetpassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      
  
      // Check if the user exists with the provided _id and email
      const usercheck = await userModel.findOne({email});
      if (!usercheck) return next(new Error("User not found"));
  
      // Generate OTP
      const otp = generateOTP();
  
      // Send email with OTP
      const isEmailSent = await sendEmailService({
        to: email,
        subject: 'Account Protection',
        message: `
          <h1>To be safe, to reset the password for this account,
          you will need to confirm your identity by entering the following single-use code</h1>
          <b style="font-size: 50px; text-align: center">Code: ${otp}</b>
        `,
      });
  
      if (!isEmailSent) return next(new Error("Failed to send email, please try again"));
  
      // Save OTP to user's document
      usercheck.passwordResetOtp = otp;
      await usercheck.save();
  
      // Respond to the client
      return res.status(200).json({ message: 'Please check your email to change your password' });
    } catch (error) {
      next(error);
    }
  };
  
  export const ressetpassword = async (req, res, next) => {
    try {
      const { otp, newpassword } = req.body;
  
      // Find user by OTP
      const user = await userModel.findOne({ passwordResetOtp: otp });
  
      if (!user) {
        return next(new Error('OTP not found or expired'));
      }
  
      // Hash new password
      const hashedPassword = bcrypt.hashSync(newpassword, +process.env.SALT_ROUNDS);
  
      // Update user's password
      user.password = hashedPassword;
      user.passwordResetOtp = null; // Clear the OTP
      await user.save();
  
      // Respond to the client
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  