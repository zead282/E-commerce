


export const paginationfunction=({size=2,page=1})=>{
    if(size<2) size=2
    if(page<1) page=1

    const limit=+size;
    const skip= limit * (+page-1)

    return{limit,skip}

}