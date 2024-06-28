
import { paginationfunction } from "./pagination.js";


export class API_features{
    constructor(query,mongoosequery){
        this.query=query;
        this.mongoosequery=mongoosequery
    }

    pagination({page,size}){
       
        const{limit,skip}=paginationfunction({page,size});
       this.mongoosequery= this.mongoosequery.limit(limit).skip(skip)
        return this
    }

    sorting(sortby){
        if(!sortby){
            this.mongoosequery=this.mongoosequery.sort({ createdAt: -1 })
            return this
        }
       
        const formula=sortby.replace(/desc/g,-1).replace(/asc/g,1)
        console.log(formula);
        let obj={}
        let parts=formula.split(' ')
        console.log(parts);
        obj[parts[0]]=+parts[1]
        console.log(obj);
        //const [key, value] = formula.split(':')
        

        this.mongoosequery=this.mongoosequery.sort(obj)

        return this
        
    }

    filter(filters){
       
        const queryfilter=JSON.parse(
            JSON.stringify(filters).replace(/gt|gte|lt|lte|in|nin|eq|ne|regex/g,(operator)=>`$${operator}`)
        )
         
        this.mongoosequery=this.mongoosequery.find(queryfilter)

        return this
    }

    search(search){
         let queryfilter={}
         if(search.title) queryfilter.title={$regex:search.title,$options:'i'}
         if(search.desc) queryfilter.desc={$regex:search.desc,$options:'i'}
         if(search.discount) queryfilter.discount={$ne:0}
         if (search.priceFrom && !search.priceTo) queryfilter.appliedprice = { $gte: search.priceFrom }
         if (search.priceTo && !search.priceFrom) queryfilter.appliedprice = { $lte: search.priceTo }
         if (search.priceTo && search.priceFrom) queryfilter.appliedprice = { $gte: search.priceFrom, $lte: search.priceTo }

        this.mongoosequery=this.mongoosequery.find(queryfilter)
        return this
    }


}