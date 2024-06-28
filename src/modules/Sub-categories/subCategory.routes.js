import { Router } from "express";
import * as subcontroller from './subCategory.controller.js';
import {auth} from '../../middlewares/auth.middleware.js';
import {endpointsroles} from '../Category/category.endpoints.js';
import {multerMiddleHost} from '../../middlewares/multer.js';
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import expressAsyncHandler from "express-async-handler";
const router=Router();

router.post('/add/:categoryid',auth(endpointsroles.add_product),
multerMiddleHost({extensions:allowedExtensions.image}).single('image'),
expressAsyncHandler(subcontroller.addsubcategory));



export default router;