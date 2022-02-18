const {removeCommentById} = require('../models/comments.model')

exports.deleteCommentById = (req, res, next) => {
    removeCommentById().then(()=>{
        console.log('controller')
        res.sendStatus(204)
    })
}