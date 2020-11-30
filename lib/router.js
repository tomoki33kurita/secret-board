'use strict'
const postsHandler = require('./posts-handler')

const route = (req, res) => {
  switch(req.url) {
    case '/posts':
      return postsHandler.handle(req, res)
    case '/logout':
      return // ここにログアウトの処理を後で記述
    default: 
    return
  }
}

module.exports = {
  route
}