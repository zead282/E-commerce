
import productmodel from "../../../../DB/Models/product.model.js";


export async function checkproductavailability(productid,quantity){
    const isproduct=await productmodel.findById(productid);

    if(!isproduct || isproduct.stock < quantity) return null
    return isproduct
}