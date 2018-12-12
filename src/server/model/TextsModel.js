const mongoose = require('mongoose');

const ColoredTextSchema = new mongoose.Schema({
  textName: String,
  text: [{
    value: String,
    pos: String
  }]

});

module.exports = mongoose.model('coloredText', ColoredTextSchema);
