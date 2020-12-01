'use strict'
const jade = require('jade')
const assert = require('assert')

// XSSの脆弱性テスト
const html = jade.renderFile('./views/posts.jade', {
  posts:[
    {
      id:1,
      content: "<script>alert('test');</script>",
      postetdBy: 'guest1',
      trackingCookie: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  user: 'guest1'
})

assert(html.includes("&lt;script&gt;alert('test');&lt;/script&gt;"))
console.log('テストが正常に完了しました')