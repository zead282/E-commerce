import { Router } from "express";
import { endpoints } from "./user.endpoints.js";
import expressAsyncHandler from "express-async-handler";
import * as usercontroller from './user.controller.js';
import { auth } from "../../middlewares/auth.middleware.js";
const router=Router();

router.delete('/delete',auth(endpoints.all),expressAsyncHandler(usercontroller.deleteaccount));

router.put('/update',auth(endpoints.all),expressAsyncHandler(usercontroller.updateuser));

router.post('/reset',expressAsyncHandler(usercontroller.ressetpassword));

router.post('/forget',expressAsyncHandler(usercontroller.forgetpassword));

export default router;