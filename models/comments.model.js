const db = require("../db/connection");

exports.selectCommentById = ({comment_id}) => {
  return db
    .query(`
    SELECT *
    FROM comments
    WHERE comment_id = $1;`, [comment_id])

    .then(({ rows }) => {
      const comment = rows[0];
      if (!comment) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.removeCommentById = ({ comment_id }) => {
  return db
    .query(
      `DELETE FROM comments
   WHERE comment_id = $1
   RETURNING *;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows) {
        return;
      }
    });
};
