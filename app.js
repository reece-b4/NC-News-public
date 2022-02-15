const express = require('express');
const {getTopics} = require('./controllers/topic.controllers.js')
const {getArticleById, patchArticleById} = require('./controllers/article.controllers.js')
const {notAPath, customErrors, sqlErrors, internalServerError} = require('./errorhandling.js')

const app = express();
app.use(express.json())

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)


// handle:global, custom, psql, server errors
app.all('/api/*', notAPath)
app.use(customErrors)
app.use(sqlErrors)
app.use(internalServerError)

module.exports = app