
import cartmodel from "../../../../DB/Models/cart.model.js"

export async function getusercart(userid){

    const usercart=await cartmodel.findOne({userId:userid})
    return usercart
}