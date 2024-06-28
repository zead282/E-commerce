import { Router } from "express";
import{auth} from '../../middlewares/auth.middleware.js'
import { systemRoles } from "../../utils/system-roles.js";
import expressAsyncHandler from "express-async-handler";
import * as cartcontroller from './cart.controller.js'
const router=Router();


router.post('/add',auth(systemRoles.USER),expressAsyncHandler(cartcontroller.addcart))

router.delete('/del/:productid',auth(systemRoles.USER),expressAsyncHandler(cartcontroller.removefromcart))
export default router;