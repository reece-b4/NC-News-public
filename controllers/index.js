const {getTopics} = require('./topics.controllers.js')
const {getArticleById, patchArticleById, getCommentsByArticleId, getArticles} = require('./articles.controllers.js')
const {getUsernames} = require('./users.controllers.js')

const controllerFuncs = {getTopics, getArticleById, patchArticleById, getCommentsByArticleId, getUsernames, getArticles}

module.exports = controllerFuncs