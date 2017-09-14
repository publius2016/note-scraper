$(function () {

  $(".navbar-nav li").on("click", (e) => {
    $("li.active").removeClass("active");
    console.log(e.target);
    $(e.target).parent().addClass("active");
  });

  var articleArray;
  function articleMaker (data) {
    $("#articleHolder").empty();
    for (var i = 0; i < data.length; i++) {
      if (data[i].saved == false) {
        var article = "<div class='article'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a><button class='saveArticle' data-id='" + data[i]._id + "'>Save</button></div>";
        $("#articleHolder").append(article);
      } else {
        var article = "<div class='article'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a><button disabled class='saveArticle disabled btn' data-id='" + data[i]._id + "'>Article Saved</button></div>";
        $("#articleHolder").append(article);
      }

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

  $(".scrape").on("click", () => {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).done(function(data) {
      console.log(data.message);
      $.ajax({
        method: "GET",
        url: "/articles"
      }).done(function(articles) {
        console.log(articles);
        console.log(Math.abs(articleArray.length - articles.length));
        var newArticles = Math.abs(articleArray.length - articles.length);
        articleArray = articles;
        console.log(articleArray.length);
        articleMaker(articles);
        $("#scrapeModal .modal-body").text(newArticles);
        $('#scrapeModal').modal();
      }); // END DONE ON AJAX FOR ALL ARTICLES
    });
  });

  $(".home").on("click", () => {
    $.ajax({
      method: "GET",
      url: "/articles"
    }).done(function(articles) {
      console.log(articles);
      articleArray = articles;
      articleMaker(articles);
    }); // END DONE ON AJAX FOR ALL ARTICLES
  });

  $("body").on("click", ".saveArticle", (e) => {
    var articleId = $(e.target).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/saver/" + articleId
    }).done(function(data) {
      console.log(data.message);
      $.ajax({
        method: "GET",
        url: "/articles"
      }).done(function(articles) {
        console.log(articles);
        articleArray = articles;
        articleMaker(articles);
        $("#saveModal .modal-body").text(data.message);
        $('#saveModal').modal();
      }); // END DONE ON AJAX FOR ALL ARTICLES


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
        var article = "<div class='article'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a><button class='noteMaker' data-id='" + data[i]._id + "'>View/Add Note</button><button class='unsaveArticle' data-id='" + data[i]._id + "'>Delete</button></div>";
        $("#articleHolder").append(article);
      }
    });
  }); // END CLICK ON SAVED ARTICLES BUTTON

  $("body").on("click", ".unsaveArticle", (e) => {
    var articleId = $(e.target).attr("data-id");
    $.ajax({
      method: "PUT",
      url: "/unsaveArticle/" + articleId
    }).done((data) => {
      console.log(data.message);
      $.ajax({
        method: "GET",
        url: "/savedArticles"
      }).done((data) => {
        console.log("Saved Page Loaded");
        console.log(data);
        $("#articleHolder").empty();
        for (var i = 0; i < data.length; i++) {
          var article = "<div class='article'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a><button class='noteMaker' data-id='" + data[i]._id + "'>View/Add Note</button><button class='unsaveArticle' data-id='" + data[i]._id + "'>Delete</button></div>";
          $("#articleHolder").append(article);
        }
      });
    }); // END DONE ON AJAX FOR UNSAVEARTICLE ROUTE
  }); // END CLICK ON UNSAVEARTICLE BUTTON
var articleIdForNoteMaker;
  $("body").on("click", ".noteMaker", (e) => {
    e.stopPropagation();
    articleIdForNoteMaker = $(e.target).attr("data-id");
    console.log(articleIdForNoteMaker);
    var articleTitle = $(e.target).siblings("a").text() + " Notes";
    $('#noteModal .notes').empty();
    $.ajax({
      method: "GET",
      url: "/articles/" + articleIdForNoteMaker
    }).done((data) => {
      console.log(data);

      if(data.note.length == 0) {
        $("#noteModal .modal-title").text(articleTitle);
        $("#noteModal .notes").html("<p class='noteText'>You have not added any notes.</p>");
        $('#noteModal').modal();
      } else {
        $("#noteModal .modal-title").text(articleTitle);
        for (var i = 0; i < data.note.length; i++) {
          $("#noteModal .notes").append("<p class='noteText'>" + data.note[i].body + "</p><button class='deleteNote' data-id='" + data.note[i]._id + "'>Delete</button>");
        }
        $('#noteModal').modal();
      }


    }); // END DONE ON AJAX FOR ARTICLE NOTEGETTER
  }); // END CLICK ON NOTEMAKER BUTTON

  $(".enterNote").on("click", (e) => {
    // e.stopPropagation();
    var noteTitle = $("#note-title").val().trim();
    var noteBody = $("#note-text").val().trim();
    console.log(articleIdForNoteMaker);

    $.ajax({
      method: "POST",
      url: "/note/" + articleIdForNoteMaker,
      data: {
        title: noteTitle,
        body: noteBody
      }
    }).done((data) => {
      console.log(data.message);
      $.ajax({
        method: "GET",
        url: "/savedArticles"
      }).done((data) => {
        console.log("Saved Page Loaded");
        console.log(data);
        $("#articleHolder").empty();
        for (var i = 0; i < data.length; i++) {
          var article = "<div class='article'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a><button class='noteMaker' data-id='" + data[i]._id + "'>View/Add Note</button><button class='unsaveArticle' data-id='" + data[i]._id + "'>Delete</button></div>";
          $("#articleHolder").append(article);
        }
      });
    }); // END DONE ON AJAX FOR NOTEMAKER ROUTE
  }); // END CLICK ON ENTERNOTE BUTTON

  $("body").on("click", ".deleteNote", (e) => {
    var noteId = $(e.target).attr("data-id");
    console.log(noteId);
    $.ajax({
      method: "PUT",
      url: "/deletenote/" + noteId
    }).done((data) => {
      console.log(data.message);
    }); // END DONE ON AJAX FOR DELETENOTE ROUTE
  }); // END CLICK ON DELETENOTE BUTTON

}); // END READY
