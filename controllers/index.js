const {getTopics} = require('./topics.controllers.js')
const {getArticleById, patchArticleById, getCommentsByArticleId, getArticles, postCommentByArticleId} = require('./articles.controllers.js')
const {getUsernames} = require('./users.controllers.js')
const {getEndpointsInfo} = require('./endpoints.info.controllers')
const {deleteCommentById} = require('./comments.controllers.js')
const controllerFuncs = {getTopics, getArticleById, patchArticleById, getCommentsByArticleId, getUsernames, getArticles, postCommentByArticleId, getEndpointsInfo, deleteCommentById}


module.exports = controllerFuncs