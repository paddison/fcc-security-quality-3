/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

let testId;

suite('Functional Tests', function() {

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post("/api/books")
          .send({title: "routingTest"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            assert.equal(res.body.title, "routingTest");
            testId = res.body._id;
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post("/api/books")
          .send({title: ""})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "err");
            assert.equal(res.body.err, "title required");
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });        
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get("/api/books/fake")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "err");
            assert.equal(res.body.err, "no book exists");
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get("/api/books/" + testId)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "_id");
          assert.property(res.body, "comments");
          assert.isArray(res.body.comments);
          assert.property(res.body, "title");
          assert.equal(res.body._id, testId);
          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post("/api/books/" + testId)
        .send({comment: "testComment"})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "_id");
          assert.property(res.body, "comments");
          assert.isArray(res.body.comments);
          assert.property(res.body, "title");
          assert.equal(res.body._id, testId);
          assert.equal(res.body.comments[0], "testComment");
          done();
        })
      });
      
    });

  });

});
