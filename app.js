const express = require('express');
const cors = require('cors');
const {getTopics, getArticleById, patchArticleById, getUsernames, getCommentsByArticleId, getArticles, postCommentByArticleId, deleteCommentById, getEndpointsInfo} = require('./controllers/index.js')
const {notAPath, customErrors, sqlErrors, serverErrors} = require('./errorhandling.js')


const app = express();
app.use(cors());
app.use(express.json())

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)
app.get('/api/users', getUsernames)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.get('/api/articles', getArticles)
app.post('/api/articles/:article_id/comments', postCommentByArticleId)
app.delete('/api/comments/:comment_id', deleteCommentById)

app.get('/api', getEndpointsInfo)

app.all('/api/*', notAPath)
app.use(customErrors)
app.use(sqlErrors)
app.use(serverErrors)

module.exports = app