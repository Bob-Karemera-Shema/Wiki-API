const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to local mongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB");

//create article schema
const articleSchema = {
  title: String,
  content: String
};

//create a mongoose article model
const Article = mongoose.model("Article", articleSchema);

//Requests targetting all articles

app.route("/articles")
.get(function(req, res){
  //retrieve all articles
  Article.find({}, function(err, articles){
    if(!err) {
      res.send(articles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){
  //add new article to DB

  let article = new Article({
    title: req.body.title,
    content: req.body.content
  });

  article.save(function(err){
    if(!err) {
      res.send("Successfully added new article");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){
  //Delete all articles from DB

  Article.deleteMany({}, function(err){
    if(!err) {
      res.send("Successfully deleted all articles");
    } else {
      res.send(err);
    }
  });
});

//Requests targetting a specific article

app.route("/articles/:articleTitle")
.get(function(req, res){
 Article.findOne({title: req.params.articleTitle}, function(err, article){
   if(!err) {
     res.send(article);
   } else {
     res.send("Article not found!");
   }
 });
})

.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err) {
      if(!err) {
        res.send("Successfully updated article");
      } else {
        res.send(err);
      }
    }
  );
})

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body}
  );
});

app.listen(3000, function(){
  console.log("Server up and running on port 3000");
});
