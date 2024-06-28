import { Router } from "express";
import {endpointsroles} from './category.endpoints.js';
import {auth} from '../../middlewares/auth.middleware.js'
import expressAsyncHandler from "express-async-handler";
import * as categorycontroller from './category.contoller.js'
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import {multerMiddleHost} from '../../middlewares/multer.js'
const router=Router();

router.post('/add',auth(endpointsroles.add_product),multerMiddleHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(categorycontroller.addcategory));

router.put('/update/:categoryid',auth(endpointsroles.update_product),multerMiddleHost({extensions:allowedExtensions.image}).single('image'),
expressAsyncHandler(categorycontroller.updatecategory));

router.get('/',expressAsyncHandler(categorycontroller.gettcategorys));
export default router;