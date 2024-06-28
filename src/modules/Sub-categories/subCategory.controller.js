
import slugify from "slugify";
import subCategoryModel from "../../../DB/Models/sub-category.model.js";
import categoryModel from "../../../DB/Models/category.model.js";
import generateUniqueString from "../../utils/generate-Unique-String.js";
import cloudinaryConnection from "../../utils/cloudinary.js";

export const addsubcategory=async(req,res,next)=>{
    const{_id}=req.authUser;
    const{name}=req.body;
    const{categoryid}=req.params;

    //1-check if category name already exist
    const isnamesxist=await subCategoryModel.findOne({name});
    if(isnamesxist) return next(new Error("choose another sub-category name"));

    //2- slug
    const slug=slugify(name,'-');

    //3-check on category
    const category=await categoryModel.findById(categoryid);
    if(!category) return next(new Error("category not found"))
    
    //4 upload photo on cloudinary
    if(!req.file) return next(new Error("image is required"));

    const folderid=generateUniqueString(4);
    const{secure_url,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER}/categories/${category.folder_id}/subcategories/${folderid}`
    })

    const subdata={
        name,
        slug,
        categoryid,
        Images:{secure_url,public_id},
        folder_id:folderid,
        addedby:_id
    }

    const subcreate=await subCategoryModel.create(subdata);
    res.status(200).json({message:"added success",dat:subcreate})
    
}