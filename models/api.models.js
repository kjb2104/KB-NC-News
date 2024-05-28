const fs = require('fs/promises')

function selectApi(){
return fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8' ).then((result)=>{
  return result
})

}


module.exports = selectApi