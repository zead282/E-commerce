
import { isproductincart } from "./check-product-in-cart.js";
import { calcsubtotal } from "./calculate-subtotal.js";
export async function updatequantity(cart,productid,quantity){
    const isproduct=await isproductincart(cart,productid);
    if(!isproduct) return null

    cart?.products.forEach((product)=>{
        if(product.productId.toString()===productid)
            {
                product.quantity=quantity
                product.finalPrice=product.basePrice*quantity
            }
    })
    
        cart.subTotal=calcsubtotal(cart.products)
        return await cart.save()
}