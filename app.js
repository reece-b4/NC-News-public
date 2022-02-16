const express = require('express');
const {getTopics} = require('./controllers/topics.controllers.js')
const {getArticleById, patchArticleById} = require('./controllers/articles.controllers.js')
const {getUsernames} = require('./controllers/users.controllers.js')
const {notAPath, customErrors, sqlErrors, serverErrors} = require('./errorhandling.js')
// put all functions into index file so can be required in one line in app.js

const app = express();
app.use(express.json())

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)
app.get('/api/users', getUsernames)


// handle:global, custom, psql, server errors
app.all('/api/*', notAPath)
app.use(customErrors)
app.use(sqlErrors)
app.use(serverErrors)

module.exports = app