exports.notAPath = (req, res) => {
  res.status(404).send({ msg: "path not found" })
};

exports.customErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({msg: err.msg})
} else {
  next(err)
}
}

exports.sqlErrors = (err, req, res, next) => {
  if ((err.code === "22P02" || err.code === "23502")) {
    res.status(400).send({ msg: "bad request" });
  } else {
      next(err)
  }
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "internal service error" });
};
