const Tour = require("../models/ToursModel");

exports.getAllTours = async (req, res) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "field"];
  excludedFields.forEach((field) => delete queryObj[field]);
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(lte|gte|lt|gt)\b/g, match=>`$${match}`)
  console.log(queryObj)
  let query = Tour.find(JSON.parse(queryStr));

  
  if (req.query.sort) query = query.sort(req.query.sort);
    const tours = await query
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = async (req, res) => {
  const id = req.params.id;
  const tour = await Tour.findById(id);
  res.status(200).json({
    status: "success",
    tour,
  });
};
