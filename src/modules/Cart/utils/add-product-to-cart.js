import { calcsubtotal } from "./calculate-subtotal.js"



export async function pushnewcart(cart,product,quantity){

    cart?.products.push({
        title:product.title,
        quantity:quantity,
        finalPrice:product.appliedprice*quantity,
        basePrice:product.appliedprice,
        productId:product._id
    })
       
        cart.subTotal=calcsubtotal(cart.products)

    await cart.save()
}