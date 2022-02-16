const {selectUsernames} = require('../models/users.models.js')

exports.getUsernames = (req, res) => {
    selectUsernames().then((usernames)=>{
res.status(200).send({usernames})
    })
    .catch((err)=>{
        console.log(err)
      
    })
}