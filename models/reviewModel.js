const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type:String,
        required: [true, 'review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'review must be rated']

    },
    createdAt: Date,
    tour:{
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    
},
{
    toJSON: {virtuals:true},
    toObject: {virtuals: true}
})

reviewSchema.pre(/^find/, function(next){
    /* this.populate({
        path: 'tour',
        select: 'name'
    }) */
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next()
})


const Review = mongoose.model('Review',reviewSchema)

module.exports = Review