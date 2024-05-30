const db = require('../db/connection.js')

function selectTopics(){

return db.query('SELECT * FROM topics;').then((result) => { 
    return result.rows
})
.catch((next))
}


module.exports = selectTopics