exports.sqlErrors = (req, res) => {
    res.status(404).send({msg:'path not found'})
}

exports.internalServiceError = (err, req, res, next) =>{
    console.log(err);
    res.status(500).send({msg: 'internal service error'})
}

//should internalService Error be here or in app.js? does it need next param?