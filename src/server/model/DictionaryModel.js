const mongoose = require('mongoose');

const DictionarySchema = new mongoose.Schema({
  word: String,
  tags: [],
  lemma: String,
  lemmaTags: [],
  settings: [{
    frequency: Number,
    textPath: String,
    textName: String
  }]
});

module.exports = mongoose.model('mydict', DictionarySchema);
