
import mongoose, { Schema, Types, model } from "mongoose";


const categoryschema=new Schema({
    name:{type:String,required:true,unique:true,trim:true},
    slug:{type:String,required:true,unique:true,trim:true},
    addedby:{type:Schema.Types.ObjectId,ref:"User"},///super admin
    updatedby:{type:Schema.Types.ObjectId,ref:"User"},///super admin
    Images:{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true,unique:true}
    },
    folder_id:{type:String,unique:true,required:true}

},
{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

categoryschema.virtual('subcategories',{
    ref:'Subcategory',
    localField:'_id',
    foreignField:'categoryid'
})


///hook

categoryschema.post("findOneAndDelete",async function() {
    const _id=this.getQuery()._id

    const deletesubcategory=await mongoose.models.Subcategory.deleteMany({
        categoryid:_id
    })

    if(deletesubcategory.deletedCount){
        const deletedbrands=await mongoose.models.Brand.deleteMany({
            categoryid:_id
        })
     
    if(deletedbrands.deletedCount)
        {
            const deleteproduct=await mongoose.models.Product.deleteMany({
                categoryid:_id
            })
        }    

    }
})

export default model('Category',categoryschema)

