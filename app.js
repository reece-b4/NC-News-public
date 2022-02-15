const express = require('express');
const {getTopics, getArticleById} = require('./controllers/controllers.js')
const {notAPath, customErrors, sqlErrors, internalServerError} = require('./errorhandling.js')

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById)

// handle:global, custom, psql, server errors
app.all('/api/*', notAPath)
app.use(customErrors)
app.use(sqlErrors)
app.use(internalServerError)

module.exports = app