
const reqkeys=['body','params','headers','query'];

export const validationmiddleware=(schema)=>{
    return (req,res,next)=>{
    let validationerrors=[];
    for(const key of reqkeys)
        {
            const validationresult=schema[key]?.validate(req[key],{abortEarly:true});

            if(validationresult?.error)
                {
                    validationerrors.push(...validationresult.error.details)
                }
        }
        if (validationerrors?.length) {
            return res.status(400).json({
                err_msg: "validation error",
                errors: validationerrors.map(ele => ele.message)
            })
        }

        next()
}
}