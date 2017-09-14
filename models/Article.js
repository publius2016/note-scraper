var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
  title: {
    type: String,
    unique: true,
    required: true
  },

  link: {
    type: String,
    unique: true,
    required: true
  },

  saved: {
    type: Boolean,
    default: false
  },

  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
}); // END ARTICLESCHEMA

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
