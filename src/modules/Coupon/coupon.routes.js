import { Router } from "express";
import {endpointsRoles}from './coupon.endpoints.js'
import {auth} from '../../middlewares/auth.middleware.js'
import * as couponcontroller from './coupon.controller.js'
import expressAsyncHandler from "express-async-handler";
const router=Router();

router.post('/add',auth(endpointsRoles.ADD_COUPOUN),expressAsyncHandler(couponcontroller.addcoupon))



export default router;