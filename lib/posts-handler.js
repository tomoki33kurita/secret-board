'use strict'
const jade = require('jade')
const Cookies = require('cookies')
const util = require('./util-handler')
const Post = require('./post')

const trackingIdKey = 'tracking_id'

const handle = (req, res) => {
  const cookies = new Cookies(req, res)
  addTrackingCookie(cookies)
  switch(req.method) {
    case 'GET':
        res.writeHead(200,{
          'Content-Type': 'text/html; charset=utf-8'
        })
        Post.findAll({order:[['id', 'DESC']]}).then((posts) => {
          posts.forEach((post) => post.content = post.content.replace(/\n/g, '<br>'))
          res.end(jade.renderFile('./views/posts.jade', {
            posts,
            user: req.user
          }))
          console.info(
            `閲覧されました：user：${req.user}, ` +
            `trackingId：${cookies.get(trackingIdKey)}, ` +
            `remoteAddress：${req.connection.remoteAddress} ` +
            `userAgent：${req.headers['user-agent']}`
          )
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
          trackingCookie: cookies.get(trackingIdKey),
          postedBy: req.user
        }).then(() => handleRedirectPosts(req, res))
      })
      return
    default:
      util.handleBadRequest(req, res)
      return
  }
}

const handleDelete = (req, res) => {
  switch(req.method) {
    case 'POST':
      let body = []
      req.on('data', (chunk) => body.push(chunk))
      .on('end', () => {
        body = Buffer.concat(body).toString()
        const decoded = decodeURIComponent(body)
        const id = decoded.split('id=')[1]
        Post.findByPk(id).then((post) => {
          if(req.user === post.postedBy || req.user === 'admin'){
            post.destroy().then(() => handleRedirectPosts(req, res))
          }
        })
        console.info(
          `削除されました：user：${req.user}, ` + 
          `remoteAddress：${req.connection.remoteAddress}, ` +
          `userAgent：${req.headers['user-agent']}`　
        )  
      })
      return 
    default:
      return util.handleBadRequest(req, res)
  }
}

const addTrackingCookie = (cookies) => {
  if(cookies.get(trackingIdKey)) return
  const trackingId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  const tomorrow = new Date(Date.now() + (1000*60*60*24))
  cookies.set(trackingIdKey, trackingId, { expires: tomorrow })
}

const handleRedirectPosts = (req, res) => {
  res.writeHead(303, {
    'Location': '/posts'
  })
  res.end()
}


module.exports = { 
  handle,
  handleDelete
}