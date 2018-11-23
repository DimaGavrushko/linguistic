const posTagger = require('wink-pos-tagger');
const tagger = posTagger();

module.exports = {
  formText
};

function formText(data) {
  let str = data.replace(/’/g, "'");
  let tmpDict;
  let wordDict = [];
  tmpDict = tagger.tagSentence(str);
  tmpDict.forEach((word) => {
    wordDict.push(word);
  });
  return wordDict;
}
