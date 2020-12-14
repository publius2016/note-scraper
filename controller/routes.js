module.exports = (app, request, bodyParser, cheerio, db) => {

  var Note = require("./../models/Note.js");
  var Article = require("./../models/Article.js");

  app.get("/scrape", (req, res) => {
    console.log(req.body.name);
    console.log(req.body.occupation);

    ////////////////////////////////////////
    // UPDATED SCRAPING CODE WITH PROMISE //
    ////////////////////////////////////////

    var promise = new Promise((resolve, reject) => {

      request("http://www.realclearpolitics.com/", async(error, response, html) => {
        if (error) {
          console.log(error);
          res.send({message: "Scrape Unsuccessful"});
        } else {
          var articleCounter = 0;
          var $ = cheerio.load(html);
          var allResults = [];

          await $(".post").each(function(i, element) {

            var result = {};

            result.title = $(element).find("a").text();
            result.link = $(element).find("a").attr("href");

            allResults.push(result);

            var articles = new Article(result);
            
            articles.save(function (err, doc) {
              if (err) {
                console.log("Save Unsuccessful");
            
                // console.log(err);
              } else {
                console.log("Save Successful");
                articleCounter++;
              }

            }); // END CALLBACK ON SAVE
          }); // END EACH
          resolve(allResults);
          // res.send({message: "Scrape Successful", counter: articleCounter});
        } // END IF/ELSE FOR REQUEST
      }); // END REQUEST

    }); // END PROMISE OBJECT INSTANTIATION

    promise.then((data) => {
      console.log("Scrape Results Array: " + JSON.stringify(data));
      res.send({message: "Scrape Successful"});
    });

    ////////////////////////////////////////////
    // ORIGINAL SCRAPING CODE WITHOUT PROMISE //
    ////////////////////////////////////////////

    // request("http://www.realclearpolitics.com/", (error, response, html) => {
    //   if (error) {
    //     console.log(error);
    //     res.send({message: "Scrape Unsuccessful"});
    //   } else {
    //     var articleCounter = 0;
    //     var $ = cheerio.load(html);
    //
    //
    //
    //     $(".post").each(function(i, element) {
    //       var result = {};
    //
    //       result.title = $(element).find("a").text();
    //       result.link = $(element).find("a").attr("href");
    //
    //       var articles = new Article(result);
    //
    //       articles.save(function (err, doc) {
    //         if (err) {
    //           console.log("Save Unsuccessful");
    //
    //           // console.log(err);
    //         } else {
    //           console.log("Save Successful");
    //           articleCounter++;
    //         }
    //
    //       }); // END CALLBACK ON SAVE
    //     }); // END EACH
    //     res.send({message: "Scrape Successful", counter: articleCounter});
    //   } // END IF/ELSE FOR REQUEST
    // }); // END REQUEST
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

  app.put("/unsaveArticle/:id", (req, res) => {
    Article.findOneAndUpdate(
      {"_id": req.params.id},
      {
        $set:
          {
            "saved": false
          }
      }, (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          res.send({message: "Article Unsaved"});
        }
      }
    ); // END ARTICLE.UPDATE
  }); // END APP.GET FOR UNSAVEARTICLES

  app.post("/note/:id", (req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    var newNote = new Note(req.body);
    newNote.save(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise
      else {
        // Use the article id to find and update it's note
        Article.findOneAndUpdate({ "_id": req.params.id },
          {
            $push:
              {
                "note": doc._id
              }
          })
        // Execute the above query
        .exec(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
            res.send({ message: "Error Saving Note"});
          }
          else {
            // Or send the document to the browser
            res.send({ message: "Successfully Saved Note"});
          }
        });
      }
    });
  }); // END APP.POST FOR NOTEMAKER ROUTE

  app.get("/articles/:id", function(req, res) {
    console.log(req.params.id);
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ "_id": req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    // now, execute our query
    .exec(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
  }); // END APP.GET FOR ARTICLENOTE ROUTE

  app.put("/deletenote/:id", (req, res) => {
    Note.remove({ "_id": req.params.id}, (err, doc) => {
      if (err) {
        console.log(err);
        res.send({message: "Error Deleting Note"});
      } else {
        res.send({message: "Note Deleted Successfully"});
      }
    }); // END NOTEREMOVE FUNCTION
  }); // END APP.PUT FOR DELETENOTE ROUTE
}; // END MODULE.EXPORTSs
