import Joi from "joi";

export const signupschema={

    body:Joi.object({
        username: Joi.string().min(5).max(10).alphanum().required().messages({
            'any.required': 'please enter your username'
        }),
        email:Joi.string().required().email({tlds:{allow:['com','org','yahoo']}}),
        age:Joi.number().min(10).max(80),
        gender: Joi.string().valid('female', 'male'),
        password:Joi.string().required(),
        cpass:Joi.string().valid(Joi.ref('password')).required(),
        addresses: Joi.alternatives().try(
            Joi.array().items(Joi.string()).messages({
                'array.base': 'Addresses must be an array of strings'
            }),
            Joi.string().messages({
                'string.base': 'Addresses must be a string'
            })
        ).required().messages({
            'any.required': 'Addresses are required'
        }),
        phoneNumbers:Joi.array(),
        role:Joi.string(),
    })
}