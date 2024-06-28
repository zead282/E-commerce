

export async function isproductincart(cart,productid){
    return cart.products.some((product)=>product.productId.toString()===productid)
}