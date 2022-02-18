const {fetchEndpointsInfo} = require('../models/endpoints.info.models')

exports.getEndpointsInfo = (req, res, next) => {
const endpoints = fetchEndpointsInfo()
console.log(endpoints)
res.status(200).send({endpoints})
}