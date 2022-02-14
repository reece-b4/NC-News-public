const express = require('express');
const {getTopics, getArticleById} = require('./controllers/controllers.js')
const {sqlErrors, internalServiceError} = require('./errorhandling.js')

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById)

app.all('/api/*', sqlErrors)
app.use(internalServiceError)

module.exports = app