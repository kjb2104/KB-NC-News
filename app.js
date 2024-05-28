const express = require('express')
const app = express();
const getTopics = require('./controllers/topics.controllers.js')
app.use(express.json());

app.get('/api/topics', getTopics);



app.all('*', (req, res) => {
    res.status(404).send({msg: "Not Found"})
      })

module.exports = app