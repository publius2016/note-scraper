module.exports = (app, request, bodyParser, cheerio, db) => {

  var Note = require("./../models/Note.js");
  var Article = require("./../models/Article.js");

  app.get("/scrape", (req, res) => {
    request("http://www.realclearpolitics.com/", (error, response, html) => {
      var $ = cheerio.load(html);

      $(".post").each(function(i, element) {
        var result = {};

        result.title = $(element).find("a").text();
        result.link = $(element).find("a").attr("href");

        var articles = new Article(result);

        articles.save(function (err, doc) {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          }

        }); // END CALLBACK ON SAVE
      }); // END EACH
    }); // END REQUEST
  }); // END APP.GET FOR SCRAPE ROUTE

  app.get("/articles", (req, res) => {
    Article.find({}, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        res.json(doc);
      }
    }); // END CALLBACK ON FIND ARTICLES
  }); //END APP.GET FOR ARTICLES ROUTE

  app.post("/saver/:id", (req, res) => {
    var articleId = req.params.id;
    console.log(articleId);
    Article.findOneAndUpdate(
      {"_id": req.params.id},
      {
        $set:
          {
            "saved": true
          }
      }, (err, doc) => {
        if (err) {
          console.log(err);
          res.send({message: "Failed to Save Article"});
        } else {
          res.send({message: "Success Saving Article"});
        }
      }
    ); // END ARTICLE.UPDATE
  }); // END APP.POST FOR ARTICLE SAVER


  app.get("/savedArticles", (req, res) => {
    Article.find({"saved": true}, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    });
  }); // END APP.GET FOR SAVED ARTICLES
}; // END MODULE.EXPORTSs
