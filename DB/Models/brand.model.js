import mongoose, { Schema, Types, model } from "mongoose";


const brandschema=new Schema({
    name:{type:String,required:true,trim:true},
    slug:{type:String,required:true,trim:true},
    addedby:{type:Schema.Types.ObjectId,ref:"User",required:true},
    categoryid:{type:Schema.Types.ObjectId,ref:"Category",required:true},
    updatedby:{type:Schema.Types.ObjectId,ref:"User"},
    subcategoryid:{type:Schema.Types.ObjectId,ref:"Subcategory",required:true},
    Images:{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true,unique:true}
    },
    folder_id:{type:String,unique:true,required:true}


},
{timestamps:true})

export default mongoose.models.brand || model('Brand',brandschema)