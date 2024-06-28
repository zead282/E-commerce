
import { DateTime } from "luxon";
import { scheduleJob } from "node-schedule";
import couponModel from "../../DB/Models/coupon.model.js";


export const scheduleCronsForCouponCheck=()=>{

    scheduleJob('*/5 * * * * *',async()=>{
        console.log('scheduleCronsForCouponCheck() is running  ............');

        const coupons=await couponModel.find({couponstatus:'valid'})
        
        for(const coupon of coupons)
            {
                if(DateTime.fromISO(coupon.toDate) < DateTime.now())
                    {
                        coupon.couponStatus = 'expired';
                        await coupon.save();
                    }
            }

    })

}

export const scheduleCronsForCouponCheck2 = () => {
    scheduleJob('*/5 * * * * *', async () => {
        console.log('scheduleCronsForCouponCheck() is running v2 ............');
        
    });
}

export const scheduleCronsForCouponCheck3 = () => {
    scheduleJob('*/5 * * * * *', async () => {
        console.log('scheduleCronsForCouponCheck() is running v3............');
        
    });
}