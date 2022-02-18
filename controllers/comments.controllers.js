const { selectCommentById } = require('../models/comments.model')
const {removeCommentById} = require('../models/comments.model')

exports.deleteCommentById = (req, res, next) => {
    selectCommentById(req.params)
    .then(()=>{
        removeCommentById(req.params) 
    })
    .then(()=>{
        res.sendStatus(204)
    })
    .catch((err)=>{
        next(err)
    })
}