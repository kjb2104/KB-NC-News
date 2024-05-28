const selectApi = require('../models/api.models.js')

function getApi(req, res, next){

    selectApi().then((resultEndPoints) =>{
        res.status(200).send(resultEndPoints)
    })
}

module.exports = getApi