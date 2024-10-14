const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "must contain name"]
    },
    duration:{
        type: Number,
        require: [true,'must contain duration']

    },
    maxGroupSize:{
        type: Number,
        default: 8
    },
    difficulty: {
        type: String,
        required: [true,'must contain difficulty'],
        enum:{
            values:['easy','medium','difficult'],
            message: 'value  not supported'
        } 
    },
    ratingsAverage:{
        type: Number,
        default: 4.7

    },
    ratingsQuantity: {
        type: Number
    },
    price:{
        type: Number,
        required: [true,'must contain price']
    },
    summary: String,
    description: String,
    imageCover: String,
    images:[String] ,
    startDates: {
        type: [String],
        select:false
    } 
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour