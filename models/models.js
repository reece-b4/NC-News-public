const db = require('../db/connection.js');

exports.selectTopics = () => {
   return db.query(`SELECT * FROM topics;`)
   .then(({rows}) => {
       return rows;
   })
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles
    WHERE article_id = $1;`, [article_id]).then(({rows})=>{
        const article = rows[0];
        if(!article) {
            return Promise.reject({status: 404,
            msg:'not found'})
        }
        return article;
    })
}