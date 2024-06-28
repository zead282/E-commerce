import { Schema, Types, model } from "mongoose";




const subcategoryschema=new Schema({
    name:{type:String,required:true,unique:true,trim:true},
    slug:{type:String,required:true,unique:true,trim:true},
    addedby:{type:Schema.Types.ObjectId,ref:"User"},///super admin
    updatedby:{type:Schema.Types.ObjectId,ref:"User"},///super admin
    Images:{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true,unique:true}
    },
    folder_id:{type:String,unique:true,required:true},
    categoryid:{type:Schema.Types.ObjectId,ref:"Category"}

},
{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

subcategoryschema.virtual('brands',{
    ref:'Brand',
    localField:'_id',
    foreignField:"subcategoryid"
})

export default model('Subcategory',subcategoryschema);