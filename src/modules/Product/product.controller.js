
import brandModel from '../../../DB/Models/brand.model.js';
import productmodel from '../../../DB/Models/product.model.js';
import { systemRoles } from '../../utils/system-roles.js';
import cloudinaryConnection from '../../utils/cloudinary.js';
import generateUniqueString from '../../utils/generate-Unique-String.js';
import slugify from 'slugify';
import { paginationfunction } from '../../utils/pagination.js';
import {API_features} from '../../utils/api-features.js'
export const addproduct=async(req,res,next)=>{
    //destruct data

    const{title,baseprice,desc,stock,discount,specs}=req.body;
    const{subCategoryId,categoryId,brandId}=req.query
    const{_id}=req.authUser;

    ///check on brand and category and subcategory
    const isbrand=await brandModel.findById(brandId);
    if(!isbrand) return next({message:"brand not found",cause:400});

    if(categoryId != isbrand.categoryid) return next({ message: 'Category not found' })
    if(subCategoryId != isbrand.subcategoryid) return next({ message: 'subCategory not found' })   
    
    if(req.authUser.role != systemRoles.SUPER_ADMIN && isbrand.addedby !=_id) return next({ message: 'You are not allowed to add product to this brand' })
    
     // generte the slug
     const slug = slugify(title, { lower: true, replacement: '-' })

     ///price

     const appliedprice=baseprice-(baseprice * (discount || 0) / 100)

     ////image

     if(!req.files?.length) return next({ message: 'Image is required' })
      let images=[];
      const folder_id=generateUniqueString(4) 

      const folder=isbrand.Images.public_id.split(`${isbrand.folder_id}/`)[0]

      for(const file of req.files){
        const{secure_url,public_id}=await cloudinaryConnection().uploader.upload(file.path,{
            folder: folder +`${isbrand.folder_id}` + `/products/${folder_id}`
         })
         images.push({secure_url,public_id})
      }
     req.folder=folder +`${isbrand.folder_id}` + `/products/${folder_id}`

   ////generate product
   const productt={title,Images:images,folder_id,slug,discount,appliedprice,baseprice,stock,desc,
    categoryId,brandId,subCategoryId,addedBy:_id,specs:JSON.parse(specs)
   }  

   const newproduct=await productmodel.create(productt);
   req.saveddocument={model:productmodel,_id:newproduct._id}

   res.status(201).json({ success: true, message: 'Product created successfully', data: newproduct })


}


////update api

export const updatedproduct=async(req,res,next)=>{

   ///destructing data
   const{_id}=req.authUser;
   const{productid}=req.params;
   const{title,oldpublicid,stock,baseprice,desc,specs,discount}=req.body;

   ////check product
   
   const isproduct=await productmodel.findById(productid);
   if(!isproduct) return next({message:"product not found",cause:400});

   ///check on authorization

   if(isproduct.addedBy != _id && req.authUser.role !=systemRoles.SUPER_ADMIN) return next({message:"you are not allowed "})
   
   if(title){
      isproduct.title=title
      isproduct.slug=slugify(title,{lower:true,replacement:'-'})
   }   

   if(desc) isproduct.desc=desc
   if(stock) isproduct.stock=stock
   if(specs) isproduct.specs=specs

   const appliedprice=(baseprice || isproduct.baseprice) * (1 - ((discount || isproduct.discount) / 100))

   isproduct.appliedprice=appliedprice;

   if(discount) isproduct.discount=discount
   if(baseprice) isproduct.baseprice=baseprice

  /////update image
   if(oldpublicid){

      if(!req.file) return next({message:'upload image'});

      const newpublicid=oldpublicid.split(`${isproduct.folder_id}/`)[1]
      const folderr=oldpublicid.split(`${isproduct.folder_id}/`)[0]

      const{secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
         folder:`${folderr}/${isproduct.folder_id}`,
         public_id:newpublicid
      })
      isproduct.Images.map((img)=>{
         if(img.public_id==oldpublicid){
            img.secure_url=secure_url
         }
      })
      req.folder=`${folderr}/${isproduct.folder_id}`;

     


   }
   await isproduct.save();

   res.status(200).json({message:"updated",product:isproduct})
}


////get all products

export const getallproducts=async(req,res,next)=>{
   const{page,size,sortby,...query}=req.query
   const features=new API_features(req.query,productmodel.find()).search(query)
   //.filter(query)
   //.sorting(sortby)
   //.pagination({page,size})

   const products=await features.mongoosequery


   res.status(202).json({message:"products",products})
}


export const deleteproduct=async(req,res,next)=>{

   const{productid}=req.params

   ///check on product

   const isproduct=await productmodel.findById(productid);

   if(!isproduct) return next(Error('product not available'));
   
    let publicids=[]

   const folderr= isproduct.Images[0].public_id.split(`${isproduct.folder_id}/`)[0] + isproduct.folder_id
  
   
   await cloudinaryConnection().api.delete_resources_by_prefix(folderr)
   await cloudinaryConnection().api.delete_folder(folderr)

   const delete_product=await productmodel.findByIdAndDelete(productid)

   res.status(200).json('deleted')

}