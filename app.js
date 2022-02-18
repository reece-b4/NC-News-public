const express = require('express');
const {getTopics, getArticleById, patchArticleById, getUsernames, getCommentsByArticleId, getArticles, postCommentByArticleId, getEndpointsInfo} = require('./controllers/index.js')
const {notAPath, customErrors, sqlErrors, serverErrors} = require('./errorhandling.js')

const app = express();
app.use(express.json())

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)
app.get('/api/users', getUsernames)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.get('/api/articles', getArticles)
app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.get('/api', getEndpointsInfo)

app.all('/api/*', notAPath)
app.use(customErrors)
app.use(sqlErrors)
app.use(serverErrors)

module.exports = app