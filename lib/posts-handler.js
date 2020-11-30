'use strict'
const handle = (req, res) => {
  switch(req.method) {
    case 'GET':
      return res.end('hi')
    case 'POST':
      return // POSTの処理を記述する
    default:
      return
  }
}

module.exports = { 
  handle 
}