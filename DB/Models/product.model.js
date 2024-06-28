
import mongoose, { Schema, model } from "mongoose";



const productschema=new Schema({
    ///strings
   title:{type:String,required:true,trim:true},
   desc:String,
   slug:{type:String,required:true},
   folder_id:{type:String,required:true,unique: true },

  ///numbers
   baseprice:{type: Number, required: true },
   discount:{type:Number,default:0},
   appliedprice:{type:Number,required:true},
   stock:{type:Number,min:0,default:0,required:true},
   rate:{type: Number, default: 0, min: 0, max: 5},

   ///arrays
   Images:[{ secure_url: { type: String, required: true },
    public_id: { type: String, required: true, unique: true }}],
    specs: {
        type: Map,
        of: [String | Number]
    }, 

    // objectIds
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updateBy: { type: Schema.Types.ObjectId, ref: 'User' },
    brandId: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    subCategoryId: { type: Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
},
{timestamps:true})


export default mongoose.models.Product || model('Product',productschema);