const db = require('../db/connection');

exports.selectUsernames = () => {
    return db.query(`SELECT username FROM users;`)
    .then(({rows})=>{
        return rows;
    })
};