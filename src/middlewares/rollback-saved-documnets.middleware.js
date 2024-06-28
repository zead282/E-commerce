


export const rollbacksaveddocuments=async(req,res,next)=>{

    if(req.saveddocument){

        const{model,_id}=req.saveddocument;
        await model.findByIdAndDelete(_id)
    }
}