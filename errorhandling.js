//label as global error/s if more
exports.notAPath = (req, res) => {
  res.status(404).send({ msg: "path not found" })
};

exports.customErrors = (err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({msg: 'not found'})
    } else {
        next(err);
    }
} 
//
exports.sqlErrors = (err, req, res, next) => {
  if ((err.code = "22P02")) {
    res.status(400).send({ msg: "bad request" });
  } else {
      next(err)
  }
};

exports.internalServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal service error" });
};
