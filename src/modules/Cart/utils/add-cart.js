import cartmodel from "../../../../DB/Models/cart.model.js";

export async function addusercart(_id,product,quantity){
   
    const cartobj={userId:_id,products:[{productId:product._id,finalPrice:product.appliedprice*quantity
        ,quantity,title:product.title,basePrice:product.appliedprice}]
        ,subTotal:product.appliedprice*quantity
    }

    const cartt=await cartmodel.create(cartobj);
    return cartt
}