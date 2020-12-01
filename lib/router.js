'use strict'
const postsHandler = require('./posts-handler')
const util = require('./util-handler')

const route = (req, res) => {
  switch(req.url) {
    case '/posts':
      return postsHandler.handle(req, res)
    case '/posts?delete=1':
      return postsHandler.handleDelete(req, res)
    case '/logout':
      return util.handleLogout(req, res)
    default: 
      util.handleNotFound(req, res)
    return
  }
}

module.exports = {
  route
}