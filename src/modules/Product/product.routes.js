import { Router } from "express";
import {multerMiddleHost} from '../../middlewares/multer.js';
import {auth} from '../../middlewares/auth.middleware.js';
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { endPointsRoles } from "./product.endpoints.js";
import expressAsyncHandler from "express-async-handler";
import * as productcontroller from './product.controller.js';
const router=Router();

router.post('/add',auth(endPointsRoles.ADD_PRODUCT),
multerMiddleHost({extensions:allowedExtensions.image}).array('image',3),expressAsyncHandler(productcontroller.addproduct));

router.put('/update/:productid',auth(endPointsRoles.ADD_PRODUCT),multerMiddleHost({extensions:allowedExtensions.image}).single('image'),
expressAsyncHandler(productcontroller.updatedproduct))


router.get('/',expressAsyncHandler(productcontroller.getallproducts))
export default router;