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

app.get("/articles", function(req, res){
  Article.find({}, function(err, articles){
    if(!err) {
      res.send(articles);
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function(){
  console.log("Server up and running on port 3000");
});
