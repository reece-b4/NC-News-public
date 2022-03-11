const { getTopics } = require("../controllers/topics.controllers.js");
const db = require("../db/connection.js");
const {selectTopics} = require('./topics.models')

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.body)::INT AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return article;
    });
};

exports.updateArticleById = (article_id, body) => {
  const { inc_votes } = body;
  return (
    db
      .query(
        `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`,
        [inc_votes, article_id]
      )
      .then(({ rows }) => {
        const article = rows[0];
        if (!article) {
          return Promise.reject({ status: 404, msg: "not found" });
        }
        return article;
      })
  );
};

exports.selectCommentsByArticleId = (article_id) => {
  return db.query(`SELECT * FROM comments
  WHERE article_id = $1;`, [article_id])
.then(({rows})=>{
  return rows
})
};

exports.selectArticles = ({sortBy = 'created_at', order = 'DESC', topic}, topicsArray) =>{

if (!['created_at', 'topic', 'author', 'title', 'votes', 'comment_count'].includes(sortBy)) {
  return Promise.reject({ status: 400, msg: 'bad request'});
}

if (!['ASC', 'DESC'].includes(order)) {
  return Promise.reject({ status: 400, msg: 'bad request'});
}

if (topic != undefined) {
if (!topicsArray.includes(topic)) {
    return Promise.reject({ status: 400, msg: 'bad request'});
  }
}

let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.body)::INT AS comment_count 
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id `

if (topic) {
queryString += `WHERE topic = '${topic}' `
}

queryString += `GROUP BY articles.article_id
ORDER BY ${sortBy} ${order};`

return db.query(queryString)
  .then(({rows})=>{
    return rows;
  })
}

exports.addCommentByArticleId = ({username, body}, article_id) => {
  if (body === undefined) {
    return Promise.reject({status: 400, msg: 'bad request'})
  }
  return db.query(`INSERT into comments
  (author, body, article_id)
  VALUES ($1, $2, $3) RETURNING *;`, [username, body, article_id])
  .then(({rows})=>{
    return rows[0];
  })
}

