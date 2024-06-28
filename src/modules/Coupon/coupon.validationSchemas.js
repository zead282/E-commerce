import Joi, { ref } from "joi"

import { generalValidationRule } from "../../utils/general.validation.rule.js"

export const addcouponvalidation={

    body:Joi.object({
        couponcode:Joi.string().required().alphanum().max(10).min(3),
        isfixed:Joi.boolean(),
        ispercentage:Joi.boolean(),
        fromdate:Joi.date().greater(Date.now()-(24*60*60*1000)).required(),
        todate:Joi.date.greater(Joi.ref('fromdate')).required(),
        couponamount:Joi.number().required(),
        users:Joi.array().items(
            Joi.object({
                userId:generalValidationRule.dbId.required(),
                maxUsage:Joi.number().required()
            })
        )
    })

}