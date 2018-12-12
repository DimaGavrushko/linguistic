const posTagger = require('wink-pos-tagger');
const tagger = posTagger();
const ColoredText = require('../model/TextsModel');
const tagsMapper = require('../tagsMapper');
const Dictionary = require('../model/DictionaryModel');

module.exports = {
  formText,
  getTextsList,
  getColoredText,
  updateColoredText,
  getAllStatistic
};

function formText(data) {
  let str = data.data.replace(/’/g, "'");
  let tmpDict;
  tmpDict = tagger.tagSentence(str);
  let colored_text = [];
  tmpDict.forEach((word) => {
    let tmpObj = {
      value: word.value,
      pos: word.pos
    };
    colored_text.push(tmpObj);
  });

  let result;
  return ColoredText.countDocuments({}).then(count => {
    result = new ColoredText({
      textName: 'myFile_' + (count + 1),
      text: colored_text
    });
    return result.save().then(() => {
      return result;
    });
  });
}

function getTextsList() {
  let result = [];
  return ColoredText.find({}).then(res => {
    res.forEach(text => {
      result.push(text.textName);
    });
    return result;
  });
}

function getColoredText(fileName) {
  let ans;
  return ColoredText.find({}).then(res => {
    res.forEach(text => {
      if (text.textName === fileName) {
        ans = text.text;
      }
    });
    return ans;
  })
}

function updateColoredText(fileName, newText) {
  return ColoredText.updateOne({textName: fileName}, {$set: {text: newText}});
}

function getAllStatistic() {
  let result = {
    tagStatistic: [],
    wordTagStatistic: [],
    tagTagStatistic: []
  };
  let tagMap = new Map();
  let word_tagMap = new Map();
  return ColoredText.find({}).then(res => {
    if (res) {

      res.forEach(text => {
        text.text.forEach(pair => {
          if (tagMap.has(pair.pos)) {
            let value = tagMap.get(pair.pos);
            tagMap.set(pair.pos, ++value);
          } else {
            tagMap.set(pair.pos, 1);
          }


          if (word_tagMap.has(pair.value.toLowerCase() + '_' + pair.pos)) {
            let value = word_tagMap.get(pair.value.toLowerCase() + '_' + pair.pos);
            word_tagMap.set(pair.value.toLowerCase() + '_' + pair.pos, ++value);
          } else {
            word_tagMap.set(pair.value.toLowerCase() + '_' + pair.pos, 1);
          }
        });

        let n = 41, m = 41;
        let tag_tag = new Array(n);
        for (let i = 0; i < n; i++) {
          tag_tag[i] = new Array(m);
        }

        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            tag_tag[i][j] = 0;
          }
        }

        for (let i = 0; i < text.text.length - 1; i++) {
          if (tagsMapper.tagToIndex[text.text[i].pos] && tagsMapper.tagToIndex[text.text[i + 1].pos]) {
            tag_tag[tagsMapper.tagToIndex[text.text[i].pos]][tagsMapper.tagToIndex[text.text[i + 1].pos]]++;
          }
        }

        result.tagTagStatistic = tag_tag;
      });
      tagMap.forEach((value, key) => {
        result.tagStatistic.push({
          tag: key,
          frequency: value
        });
      });
    }

    return Dictionary.find({}).then(res => {

      res.forEach(word => {
        word.tags.forEach(tag => {
          if (!word_tagMap.has(word.word.toLowerCase() + '_' + tag)) {
            word_tagMap.set(word.word.toLowerCase() + '_' + tag, 0);
          }
        });
      });

      word_tagMap.forEach((value, key) => {
        result.wordTagStatistic.push({
          wordTag: key,
          frequency: value
        });
      });
      return result;
    });

  });
}
