'use strict'

const handleLogout = (req, res) => {
  res.writeHead(401, {'Content-Type': 'text/plain; charset=utf-8'})
  res.end('ログアウトしました！お疲れ様でした！')
}

const handleNotFound = (req, res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('ページが見つかりません')
}

const handleBadRequest = (req, res) => {
  res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('ごめんなさい、これは未対応のメソッドです。')
}

module.exports = {
  handleLogout,
  handleNotFound,
  handleBadRequest
}