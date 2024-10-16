class APIFeatures{
    constructor(query,queryStr){
      this.query = query;
      this.queryStr = queryStr
    }
    filter(){
      const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "sort", "limit", "field"];
    excludedFields.forEach((field) => delete queryObj[field]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lte|gte|lt|gt)\b/g, (match) => `$${match}`);
    
    this.query.find(JSON.parse(queryStr));
    return this
  
  
    }
    sort(){
      if (this.queryStr.sort) {
        const sortBy = this.queryStr.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-createdAt");
      }
      return this
  
    }
    field(){
      if (this.queryStr.field) {
        const fields = this.queryStr.field.split(",").join(" ");
        this.query = this.query.select(fields)
      }
      return this
      
    }
    limit(){
      let limit;
      if(this.queryStr.limit){
        limit = +this.queryStr.limit
        this.query = this.query.limit(limit)
      }
      return this
      
    }
    paginate(){
      if(this.queryStr.page ){
        const page = +this.queryStr.page
        const limit = +this.queryStr.limit
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip)
      } 
      return this
    }
  
  }

  module.exports = APIFeatures