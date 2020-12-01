'use strict'
const jade = require('jade')
const util = require('./util-handler')
const Post = require('./post')

const handle = (req, res) => {
  switch(req.method) {
    case 'GET':
        res.writeHead(200,{
          'Content-Type': 'text/html; charset=utf-8'
        })
        Post.findAll({order:[['id', 'DESC']]}).then((posts) => {
          res.end(jade.renderFile('./views/posts.jade', {
            posts
          }))
        })
      return 
    case 'POST':
      let body = []
      req.on('data', (chunk) => {
        body.push(chunk)
      }).on('end', () => {
        body = Buffer.concat(body).toString()
        const decoded = decodeURIComponent(body)
        const content = decoded.split('content=')[1]
        console.info('いま投稿されたもの: ' + content)
        Post.create({
          content,
          trackingCookie: null,
          postedBy: req.user
        }).then(() => handleRedirectPosts(req, res))
      })
      return
    default:
      util.handleBadRequest(req, res)
      return
  }
}

const handleRedirectPosts = (req, res) => {
  res.writeHead(303, {
    'Location': '/posts'
  })
  res.end()
}


module.exports = { 
  handle 
}