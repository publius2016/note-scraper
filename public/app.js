$(function () {

  var articleArray;
  function articleMaker (data) {
    $("#articleHolder").empty();
    for (var i = 0; i < data.length; i++) {
      var article = "<div class='article'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a><button class='saveArticle' data-id='" + data[i]._id + "'>Save</button></div>";
      $("#articleHolder").append(article);
    }
  }; // END ARTICLEMAKER FUNCTION

  $.ajax({
    method: "GET",
    url: "/articles"
  }).done(function(articles) {
    console.log(articles);
    articleArray = articles;
    articleMaker(articles);
  }); // END DONE ON AJAX FOR ALL ARTICLES

  $(".home").on("click", () => {
    articleMaker(articleArray);
  });

  $("body").on("click", ".saveArticle", (e) => {
    var articleId = $(e.target).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/saver/" + articleId
    }).done(function(data) {
      console.log(data.message);
    }); // END DONE ON AJAX FOR ARTICLE SAVER
  }); // END CLICK ON SAVE BUTTONS

  $(".saver").on("click", () => {
    $.ajax({
      method: "GET",
      url: "/savedArticles"
    }).done((data) => {
      console.log("Saved Page Loaded");
      console.log(data);
      $("#articleHolder").empty();
      for (var i = 0; i < data.length; i++) {
        var article = "<div class='article'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a><button class='noteMaker' data-id='" + data[i]._id + "'>Add Note</button><button class='deleteArticle' data-id='" + data[i]._id + "'>Delete</button></div>";
        $("#articleHolder").append(article);
      }
    });
  }); // END CLICK ON SAVED ARTICLES BUTTON
}); // END READY
