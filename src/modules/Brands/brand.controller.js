
import slugify from "slugify";
import brandModel from "../../../DB/Models/brand.model.js";
import subCategoryModel from "../../../DB/Models/sub-category.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generate-Unique-String.js";


export const addbrand=async(req,res,next)=>{
 ///destruct data
    const{_id}=req.authUser;
    const{name}=req.body;
    const{categoryid,subcategoryid}=req.query;

    //check on subcategory
    const issubcategory=await subCategoryModel.findById(subcategoryid).populate('categoryid','folder_id');
    if(!issubcategory) return next({message:"subcategory noot found",cause:400});
    
    //brand dublicate check
    const isbrand=await brandModel.findOne({name,subcategoryid});
    if(isbrand) return next({message:"brand already exist for this subcategory",cause:400})
    
    ///check on category
    if(categoryid != issubcategory.categoryid._id)  return next({message:"category not found",cause:400});  

  //generate slug
    const slug=slugify(name,'-');
  //upload image
    if(!req.file){
        return next({message:"upload brand logo",cause:400})
    }
     const folderid=generateUniqueString(4)
    const{secure_url,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER}/categories/${issubcategory.categoryid.folder_id}/subcategories/${issubcategory.folder_id}/brand/${folderid}`

    })

    const newbrand={
        name,
        slug,
        folder_id:folderid,
        addedby:_id,
        Images:{secure_url,public_id},
        categoryid,
        subcategoryid
    }

    const addbrand=await brandModel.create(newbrand);

    res.status(201).json({
        message:"brand added success",
        date:addbrand
    })
}

export const updatebrand=async(req,res,next)=>{
    ///destruct data
    const{name,oldpublicid}=req.body;
    const{brandid}=req.params;
    const{_id}=req.authUser;
    
   
    //check if brand exist or noo
    const isbrand=await brandModel.findById(brandid);
    if(!isbrand) return next({message:"brand not found",cause:400});

    if(name)
        { 
            isbrand.name=name;
            isbrand.slug=slugify(name,'-');
            
        }


    //check if want to upload photo
    if(oldpublicid)
        {
            if(!req.file) return next({message:"upload photo",cause:404})
            
            const newpublicid=oldpublicid.split(`${isbrand.folder_id}/`)[1]  
            const folder=oldpublicid.split(`${isbrand.folder_id}`)[0]    
            
                
            const{secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
                 folder:`${folder}/${isbrand.folder_id}`,
                 public_id:newpublicid
                })

            isbrand.secure_url=secure_url    

        }
        isbrand.updatedby=_id

        ///save changes
        await isbrand.save();

        res.status(200).json({message:"updated success",data:isbrand})

}