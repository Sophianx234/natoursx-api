const express = require('express');
const tourRouter = require('./routes/ToursRoute')
const app = express()
const morgan = require('morgan')
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/v1/tours', tourRouter)



module.exports = app