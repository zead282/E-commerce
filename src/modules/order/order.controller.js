
import {couponValidation} from '../../utils/coupon-validation.js'
import orderModel from '../../../DB/Models/order.model.js'
import {checkproductavailability} from '../Cart/utils/check-product-in-db.js'
import { DateTime } from 'luxon'
import CouponUsers from'../../../DB/Models/coupon-users.model.js'
import {qrCodeGeneration} from '../../utils/qr-code.js'
import {getusercart} from '../Cart/utils/get-user-cart.js'
import cartModel from '../../../DB/Models/cart.model.js'
import productModel from '../../../DB/Models/product.model.js'
import {createStripeCoupon,createCheckoutSession,createPaymentIntent } from'../../payment-handler/stripe.js'
export const createorder=async(req,res,next)=>{

    ///destructing data
    const{ product,  // product id
        quantity,
        couponCode,
        paymentMethod,
        phoneNumbers,
        address,
        city,
        postalCode,
        country}=req.body

        const  {_id:user} = req.authUser

        ///check on coupon
        let coupon=null
        if(couponCode)
            {
                const iscoupon=await couponValidation(couponCode,user)
                if(iscoupon.status) return next({message:iscoupon.message,cause:iscoupon.status})
                coupon=iscoupon
            }

        ///product available or no
        
        const isproduct=await checkproductavailability(product,quantity)
        if(!isproduct) return next({message:"product not available",cause:400})

        ///item
        
        let orderItems=[{
            title:isproduct.title,
            quantity,
            price:isproduct.appliedprice,
            product
        }]

       ////prices
       let shippingPrice=orderItems[0].price * quantity
       let totalPrice=shippingPrice 
       
       
       if(coupon?.isfixed && !(coupon?.couponamount <= shippingPrice)) return next({message:"this coupon you can nnot use",cause:400})
       
       if(coupon?.isfixed){
           totalPrice=shippingPrice - coupon.couponamount;
          
       }
       else if(coupon?.ispercentage) {
            totalPrice = shippingPrice - (shippingPrice * coupon.couponAmount / 100);
       }

        // Validate totalPrice
    if (isNaN(totalPrice)) {
        return next({ message: "Total price calculation resulted in NaN", cause: 400 });
      }

       ///payment
       let orderStatus;
       if(paymentMethod === 'Cash') orderStatus = 'Placed';

       const order = new orderModel({
        user,
        orderItems,
        shippingAddress: {address, city, postalCode, country},
        phoneNumbers,
        shippingPrice,
        coupon: coupon?._id,
        totalPrice,
        paymentMethod,
        orderStatus
    });
    await order.save();

    isproduct.stock-=quantity;
    await isproduct.save();

    if(coupon){
        
        await CouponUsers.updateOne({couponId:coupon._id, userId:user}, {$inc: {usageCount: 1}});
    }

    const orderQR =await qrCodeGeneration([{orderId: order._id, user: order.user, totalPrice: order.totalPrice, orderStatus: order.orderStatus}]);
    res.status(201).json({message: 'Order created successfully', orderQR});

        

}



export const convertcarttoorder=async(req,res,next)=>{

    ///destructing data
    const{
        couponCode,
        paymentMethod,
        phoneNumbers,
        address,
        city,
        postalCode,
        country}=req.body

        const  {_id:user} = req.authUser
        ///check on cart
        const usercart=await getusercart(user);
        if(!usercart) return next({message:"user not have cart",cause:400})
        ///check on coupon
        let coupon=null
        if(couponCode)
            {
                const iscoupon=await couponValidation(couponCode,user)
                if(iscoupon.status) return next({message:iscoupon.message,cause:iscoupon.status})
                coupon=iscoupon
            }



        ///item
        let orderItems=usercart.products.map(item=>{
            return{
                title:item.title,
                quantity:item.quantity,
                price:item.basePrice,
                product:item.productId
            }
        })
        
    

       ////prices
       let shippingPrice=usercart.subTotal
       let totalPrice=shippingPrice 
       
       
       
       if(coupon?.isfixed && !(coupon?.couponamount <= shippingPrice)) return next({message:"this coupon you can nnot use",cause:400})
       
       if(coupon?.isfixed){
           totalPrice=shippingPrice - coupon.couponamount;
          
       }
       else if(coupon?.ispercentage) {
            totalPrice = shippingPrice - (shippingPrice * coupon.couponAmount / 100);
       }

        // Validate totalPrice
    if (isNaN(totalPrice)) {
        return next({ message: "Total price calculation resulted in NaN", cause: 400 });
      }

       ///payment
       let orderStatus;
       if(paymentMethod === 'Cash') orderStatus = 'Placed';

       const order = new orderModel({
        user,
        orderItems,
        shippingAddress: {address, city, postalCode, country},
        phoneNumbers,
        shippingPrice,
        coupon: coupon?._id,
        totalPrice,
        paymentMethod,
        orderStatus
    });
    await order.save();
    await cartModel.findByIdAndDelete(usercart._id)

    for(const item of order.orderItems){
        await productModel.updateOne({_id:item.product},{$inc:{stock: -item.quantity}})
    }

    

    if(coupon){
        
        await CouponUsers.updateOne({couponId:coupon._id, userId:user}, {$inc: {usageCount: 1}});
    }

    res.status(201).json({message: 'Order created successfully', order});

        

}




// ======================= order delivery =======================//
export const delieverOrder = async (req, res, next) => {
    const {orderId}= req.params;

    const updateOrder = await orderModel.findOneAndUpdate({
        _id: orderId,
        orderStatus: {$in: ['Paid','Placed']}
    },{
        orderStatus: 'Delivered',
        deliveredAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        deliveredBy: req.authUser._id,
        isDelivered: true
    },{
        new: true
    })

   if(!updateOrder) return next({message: 'Order not found or cannot be delivered', cause: 404});

    res.status(200).json({message: 'Order delivered successfully', order: updateOrder});
}



// ======================= order payment with stipe =======================//
export const payWithStripe = async (req, res, next) => {
    const {orderId}= req.params;
    const {_id:userId} = req.authUser;

    // get order details from our database
    const order = await orderModel.findOne({_id:orderId , user: userId , orderStatus: 'Pending'});
    if(!order) return next({message: 'Order not found or cannot be paid', cause: 404});

    const paymentObject = {
        customer_email:req.authUser.email,
        metadata:{orderId: order._id.toString()},
        discounts:[],
        line_items:order.orderItems.map(item => {
            return {
                price_data: {
                    currency: 'EGP',
                    product_data: {
                        name: item.title,
                    },
                    unit_amount: item.price * 100, // in cents
                },
                quantity: item.quantity,
            }
        })
    }
    // coupon check 
    if(order.coupon){
        const stripeCoupon = await createStripeCoupon({couponId: order.coupon});
        if(stripeCoupon.status) return next({message: stripeCoupon.message, cause: 400});

        paymentObject.discounts.push({
            coupon: stripeCoupon.id
        });
    }

    const checkoutSession = await createCheckoutSession(paymentObject);
    const paymentIntent = await createPaymentIntent({amount: order.totalPrice, currency: 'EGP'})

    order.payment_intent = paymentIntent.id;
    await order.save();

    res.status(200).json({checkoutSession , paymentIntent});
}


//====================== apply webhook locally to confirm the  order =======================//
export const stripeWebhookLocal  =  async (req,res,next) => {
    const orderId = req.body.data.object.metadata.orderId

    const confirmedOrder  = await orderModel.findById(orderId )
    if(!confirmedOrder) return next({message: 'Order not found', cause: 404});
    
    await confirmPaymentIntent( {paymentIntentId: confirmedOrder.payment_intent} );

    confirmedOrder.isPaid = true;
    confirmedOrder.paidAt = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');
    confirmedOrder.orderStatus = 'Paid';

    await confirmedOrder.save();

    res.status(200).json({message: 'webhook received'});
}


export const refundOrder = async (req, res, next) => {
    const{orderId} = req.params; 

    const findOrder = await orderModel.findOne({_id: orderId, orderStatus: 'Paid'});
    if(!findOrder) return next({message: 'Order not found or cannot be refunded', cause: 404});

    // refund the payment intent
    const refund = await refundPaymentIntent({paymentIntentId: findOrder.payment_intent});

    findOrder.orderStatus = 'Refunded';
    await findOrder.save();

    res.status(200).json({message: 'Order refunded successfully', order: refund});
}