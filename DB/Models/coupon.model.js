import mongoose, {  Schema, model } from "mongoose";

const couponschema=new Schema({
    couponcode:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:true
    },
    isfixed:{
        type:Boolean,
        default:false,
    },
    couponstatus:{
        type:String,
        enum:['valid','expired'],
        default:'valid'
    },
    ispercentage:{
        type:Boolean,
        default:false,
    },
    couponamount:{
        type:Number,
        min:1,
        required:true
    },
    fromdate:{
        type:String,
        required:true 
    },
    todate:{
        type:String,
        required:true
    },
    addedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'   
    }
},    
{timestamps:true})

export default mongoose.models.Coupon || model('Coupon',couponschema)