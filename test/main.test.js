var fs = require('fs')
var assert = require('assert')
var Rill = require('rill')
var agent = require('supertest')
var compress = require('../server')
var text = fs.readFileSync(__filename, 'utf8')

describe('Rill/Compress', function () {
  var request = agent(
    Rill()
      .use(compress())
      .get('/', function (ctx) {
        ctx.res.body = fs.createReadStream(__filename)
      })
      .get('/text', function (ctx) {
        ctx.res.body = text
      })
      .listen()
  )

  it('should compress with gzip', function (done) {
    request
      .get('/')
      .expect(200)
      .expect(function (res) {
        assert.equal(res.get('Content-Encoding'), 'gzip')
      })
      .end(done)
  })

  it('should compress with deflate', function (done) {
    request
      .get('/')
      .expect(200)
      .set('accept-encoding', 'deflate')
      .expect(function (res) {
        assert.equal(res.get('Content-Encoding'), 'deflate')
      })
      .end(done)
  })

  it('should send identity', function (done) {
    request
      .get('/')
      .expect(200)
      .set('accept-encoding', 'identity')
      .expect(function (res) {
        assert.equal(res.get('Content-Encoding'), undefined)
      })
      .end(done)
  })

  it('should compress text', function (done) {
    request
      .get('/text')
      .expect(200)
      .set('accept-encoding', 'gzip')
      .expect(function (res) {
        assert.equal(res.get('Content-Encoding'), 'gzip')
      })
      .end(done)
  })
})
