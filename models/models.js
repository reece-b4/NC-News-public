const db = require('../db/connection.js');

exports.selectTopics = () => {
   return db.query(`SELECT * FROM topics;`)
   .then(({rows}) => {
       return rows;
   })
}

exports.selectArticleById = (article_id) => {
    console.log(article_id)
    return db.query(`SELECT * FROM articles
    WHERE article_id = $1;`, [article_id]).then(({rows})=>{
        return rows[0]
    })
}