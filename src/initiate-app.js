import DB_connection from "../DB/connection.js"
import { globalResponse } from "./middlewares/global-response.middleware.js"
import { rollbacksaveddocuments } from "./middlewares/rollback-saved-documnets.middleware.js"
import { rollbackuploadfiles } from "./middlewares/rollback-uploaded-files.middleware.js"

import {
    scheduleCronsForCouponCheck, 
   scheduleCronsForCouponCheck2, 
   scheduleCronsForCouponCheck3 
} from './utils/crons.js'
import { gracefulShutdown } from "node-schedule"
import * as  routers from './modules/index.routes.js'


export const initiateApp = (app, express) => {

    const port = process.env.PORT


    app.use(express.json())

    DB_connection()
    app.use('/auth', routers.authrouter)
    app.use('/user', routers.userrouter)
    app.use('/category', routers.categoryrouter)
    app.use('/subCategory', routers.subcategoryrouter)
    app.use('/brand', routers.brandrouter)
    app.use('/product',routers.productrouter)
    app.use('/cart',routers.cartrouter)
    app.use('/coupon',routers.couponrouter)
    app.use('/order',routers.orderrouter)

    app.use('*',(req,res,next)=>{
        res.status(404).json({message:"notfound"})
    })

    app.use(globalResponse,rollbackuploadfiles,rollbacksaveddocuments)
    scheduleCronsForCouponCheck()
    scheduleCronsForCouponCheck2()
    scheduleCronsForCouponCheck3()
    gracefulShutdown()
    app.get('/', (req, res) => res.send('Hello World!'))
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))

}