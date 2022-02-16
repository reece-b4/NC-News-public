const db = require('../db/connection.js')

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1;`,
      [article_id]
    )
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
  return db
    .query(`
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`,
      [inc_votes, article_id]
    )
    //refactor then block later to seperate function?
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return article;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db.query(`SELECT * FROM comments
  WHERE article_id = $1;`, [article_id])
.then(({rows})=>{
  return rows
})
};
