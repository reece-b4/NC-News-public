const express = require('express');
const {getTopics} = require('./controllers/controllers.js')
const {sqlErrors, internalServiceError} = require('./errorhandling.js')

const app = express();

app.get('/api/topics', getTopics);

app.all('/api/*', sqlErrors)
app.use(internalServiceError)

module.exports = app