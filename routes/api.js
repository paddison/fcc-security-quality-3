/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;

var ObjectId = require('mongodb').ObjectId;

//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {

  let collection = db.collection("books");

  app.route('/api/books')
    .get(function (req, res){

      collection.find().toArray((err, data) => {
        data.forEach(val => {
          val.commentcount = val.comments.length;
          delete val.comments;
        })
        res.json(data);
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      if (!req.body.title || req.body.title === "") {
        res.json({err: "title required"});
      }else {
        var title = req.body.title;
        console.log("post")
        //response will contain new book object including atleast _id and title
        collection.insertOne({title: title, comments: []}, (err, data) => {
          res.json({
            _id: data.ops[0]._id,
            title: data.ops[0].title
          });
        })
      }
    })
    
    .delete(function(req, res){
      let response;
      collection.deleteMany({}, (err, result) => {
        if (err) {
          response = "error: couldn't delete books";
        }else {
          response = "complete delete successful"
        }
        res.json(response);
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;

      try {
        var id = new ObjectId(bookid)
      }
      catch(err){
        //console.log("invalid id, set to null")
        var id = null;
      }

      let response;
      collection.findOne({_id: id}, (err, data) => {
        if (err || !data) {
          response = {err: "no book exists"};
        }else {
          response = data;
        }
        res.json(response);
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;


      try {
        var id = new ObjectId(bookid)
      }
      catch(err){
        //console.log("invalid id, set to null")
        var id = null;
      }

      let response;

      collection.findOneAndUpdate({_id: id}, {$push: {comments: comment}}, (err, data) => {
        if (err || !data) {
          response = {err: "no book exists"};
        } else {
          response = data.value;
          response.comments.push(comment);
        }
        res.json(response)
      })

      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;

      try {
        var id = new ObjectId(bookid)
      }
      catch(err){
        //console.log("invalid id, set to null")
        var id = null;
      }

      let response;
      collection.deleteOne({_id: id}, (err, result) => {
        if (err) {
          response = "no book exists";
        }else {
          response = "delete successful"
        }
        res.json(response);
      })
      //if successful response will be 'delete successful'
    });
  
};

