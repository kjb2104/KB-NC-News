const selectApi = require('../models/api.models.js')

function getApi(req, res, next){

    selectApi().then((result) =>{
        res.status(200).send(result)
    })
}

module.exports = getApi