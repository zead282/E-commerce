
import cartmodel from '../../../DB/Models/cart.model.js';
import productmodel from '../../../DB/Models/product.model.js'
import {checkproductavailability} from './utils/check-product-in-db.js'
import { getusercart } from './utils/get-user-cart.js';
import { addusercart } from './utils/add-cart.js';
import { updatequantity } from './utils/update-product-quantity.js';
import { pushnewcart } from './utils/add-product-to-cart.js';
import { calcsubtotal } from './utils/calculate-subtotal.js';

///destruct data

///check product availability and quantity
//check if user has cart or no

//if has cart
//if no cart

export const addcart=async(req,res,next)=>{

    const{_id}=req.authUser;
    const{productid,quantity}=req.body;

    const isproduct=await checkproductavailability(productid,quantity)
    if(!isproduct) return next('product not found or unavailable')
    
    const usercart=await getusercart(_id)
    
    if(!usercart)
        {
           const newcart=await addusercart(_id,isproduct,quantity)
           
            return res.status(200).json({message:"product added",data:newcart})

        }

    ///have cart

    const isupdated=await updatequantity(usercart,productid,quantity)
    ///product not have been in cart
    if(!isupdated)
        {
            const added=await pushnewcart(usercart,isproduct,quantity)
            if(!addcart) return res.json("product not added to cart")
        }
    
    res.status(200).json({message:"products",usercart})    
}


export const removefromcart=async(req,res,next)=>{
    const{_id}=req.authUser;
    const{productid}=req.params;

    ///check on cart

    const usercart=await cartmodel.findOne({userId:_id,'products.productId':productid})

    if(!usercart) return next("product not found in cart")
    ///remove product from cart
    usercart.products=usercart.products.filter((product)=>product.productId.toString() !== productid)    

  
    usercart.subTotal=calcsubtotal(usercart.products)
    const newcart=await usercart.save()

    ///if(user cart empty remove cart)
    if(newcart.products.length===0)
        {
            await cartmodel.findByIdAndDelete(newcart._id)
        }
    res.status(200).json({message:"product deleted successfuly",data:newcart})    
        
}