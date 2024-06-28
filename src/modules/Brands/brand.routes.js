import { Router } from "express";
import {auth} from '../../middlewares/auth.middleware.js';
import {multerMiddleHost} from '../../middlewares/multer.js';
import expressAsyncHandler from "express-async-handler";
import { endPointsRoles } from "./brand.endpoints.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import * as brandcontroller from './brand.controller.js';
const router=Router();


router.post('/add',auth(endPointsRoles.ADD_BRAND),multerMiddleHost({extensions:allowedExtensions.image}).single('image'),
expressAsyncHandler(brandcontroller.addbrand))

router.put('/update/:brandid',auth(endPointsRoles.ADD_BRAND),multerMiddleHost({extensions:allowedExtensions.image}).single('image'),
expressAsyncHandler(brandcontroller.updatebrand))
export default router;