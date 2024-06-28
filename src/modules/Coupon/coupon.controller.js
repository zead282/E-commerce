
import couponModel from "../../../DB/Models/coupon.model.js";
import couponUsersModel from "../../../DB/Models/coupon-users.model.js";
import userModel from "../../../DB/Models/user.model.js";

export const addcoupon=async(req,res,next)=>{

    const{couponcode,isfixed,ispercentage,couponamount,fromdate,todate,
        Users //[{userid,maxusage}]
    }=req.body
    const{_id:addedby}=req.authUser;

    /////if coupon already exist

    const iscoupon=await couponModel.findOne({couponcode});

    if(iscoupon) return next({message:"coupon code already exist",cause:409})
    
    ///check if isfixed and percentage 
    if(isfixed == ispercentage) return next({message:"coupon can be either fixed or percentage"})
    
        
    ///create object
    const coubonobj={
        isfixed,ispercentage,couponamount,fromdate,todate,couponcode,addedby
    }    
    const coupon=await couponModel.create(coubonobj);

    const usersids=[];

    for(const user of Users){
        usersids.push(user.userId)
    }
    const userexist=await userModel.find({_id:{$in:usersids}})
    if(userexist.length != usersids.length) return next("user not found")

    const couponusers=await couponUsersModel.create(Users.map(el=>({...el,couponId:coupon._id})))
    res.status(200).json({message:"coupon created",coupon})


}