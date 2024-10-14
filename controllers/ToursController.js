const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,(err)=>{
    console.log('could not read file')
}))
exports.getAllTours = async(req,res)=>{
    try{
        res.status(200).json({
            status: 'success',
            result: tours.length,
            data:{
                tours

            }
        })
    }catch(err){
        res.json({
            status: 'fail',
            message: err.message
        })
    }
}