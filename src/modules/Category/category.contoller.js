
import categoryModel from "../../../DB/Models/category.model.js";
import generateUniqueString from '../../utils/generate-Unique-String.js';
import slugify from "slugify";
import cloudinaryConnection from '../../utils/cloudinary.js';

export const addcategory=async(req,res,next)=>{
    const{name}=req.body;
    const{_id}=req.authUser;

    const isnamesxist=await categoryModel.findOne({name});
    if(isnamesxist) return next(new Error("category name already exist"));
    const folderid=generateUniqueString(4);
    const slug=slugify(name,'-');

    if(!req.file) return next(new Error("image is require"));
    const{secure_url,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER}/categories/${folderid}`
    })
    req.folder=`${process.env.MAIN_FOLDER}/categories/${folderid}`

    const categorydata={
        name,
        slug,
        Images:{secure_url,public_id},
        folder_id:folderid,
        addedby:_id

    }
    const categorycreated=await categoryModel.create(categorydata);
    ///rollback
    req.saveddocument={model:categoryModel,_id:categorycreated._id}
   
    res.status(200).json({message:"category created",data:categorycreated});
}

export const updatecategory=async(req,res,next)=>{
    const{name,oldpublicid}=req.body;
    const{_id}=req.authUser;
    const{categoryid}=req.params;

    const category=await categoryModel.findById(categoryid);
    if(!category) return next(new Error("category not found"));
    
    if(name){
        const findname=await categoryModel.findOne({name});
        if(findname) return next(new Error("please enter another name"));

        category.name=name;
        category.slug=slugify(name,'-');

    }
    if(oldpublicid)
        {
            if (!req.file) return next({ cause: 400, message: 'Image is required' })
            const newpublicid=oldpublicid.split(`${category.folder_id}/`)[1];
            const{secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
                folder:`${process.env.MAIN_FOLDER}/categories/${category.folder_id}`,
                public_id:newpublicid
            })    

            category.Images.secure_url=secure_url;
        }
        category.updatedby=_id;

     await category.save();
     res.status(200).json({message:"updated",date:category});   
}

export const gettcategorys=async(req,res,next)=>{
     
    const categories=await categoryModel.find().populate([{path:"subcategories",populate:[{path:"brands"}]}]);
    res.json({message:"categorys and sub categories",data:categories});
}

