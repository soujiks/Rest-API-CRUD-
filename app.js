const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});
const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);
/////////////////////////All Articles///////////////////////////////////
app.route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    })
  })
  .post(function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    console.log(title);
    console.log(content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added artciles");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    })
  });
/////////////////////////Individual Articles///////////////////////////////////
  app.route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne({title:req.params.articleTitle},function (err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send("Article not found");
      }
    })
  })
  .patch(function(req, res){
    const articleTitle = req.params.articleTitle;
    Article.updateOne(
      {title: articleTitle},
      {$set: req.body},
      function(err){
        if (!err){
          res.send("Successfully updated selected article.");
        } else {
          res.send(err);
        }
      });
  })
  .put(function(req, res){

    const articleTitle = req.params.articleTitle;
  
    Article.updateOne(
      {title: articleTitle},
      {content: req.body.newContent},
      {overwrite: true},
      function(err){
        if (!err){
          res.send("Successfully updated the content of the selected article.");
        } else {
          res.send(err);
        }
      }
      );
  });
  

app.listen(3000, function () {
  console.log("Server started on port 3000");
});