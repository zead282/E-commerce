import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
import expressAsyncHandler from "express-async-handler";
import * as ordercontroller from './order.controller.js'
const router=Router();


router.post('/add',auth(systemRoles.USER),expressAsyncHandler(ordercontroller.createorder))

router.post('/carttoorder',auth(systemRoles.USER),expressAsyncHandler(ordercontroller.convertcarttoorder))

router.put('/:orderId',
    auth([systemRoles.DELIEVER_ROLE]),
    expressAsyncHandler(ordercontroller.delieverOrder))
    
router.post(
        '/stripePay/:orderId',
        auth([systemRoles.USER]),
        expressAsyncHandler(ordercontroller.payWithStripe) )



router.post('/webhook',
            expressAsyncHandler(ordercontroller.stripeWebhookLocal))
            
            
router.post('/refund/:orderId',
            auth([systemRoles.SUPER_ADMIN, systemRoles.ADMIN]),
            expressAsyncHandler(ordercontroller.refundOrder))
            
export default router;