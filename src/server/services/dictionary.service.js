const Dictionary = require('../model/DictionaryModel');
const posTagger = require('wink-pos-tagger');
const tagger = posTagger();
const brill = require('brill');
const lemmatize = require('wink-lemmatizer');
const tagsMapper = require('../tagsMapper');

module.exports = {
  updateDictionary,
  getAllDictionary,
  updateWordInDictionary,
  addNewWord,
  deleteTag,
  addTag
};

function formDictionary(data, path, name) {
  let str = data.replace(/["\r\n“”\\]/g, "");
  str = str.replace(/’/g, "'");
  let tmpDict;
  let wordDict = [];
  tmpDict = tagger.tagSentence(str);
  tmpDict.forEach((word) => {
    if (word.value[0] === '\'' || word.value === 'n\'t' || word.value === 'wo') {
      if (word.lemma) {
        word = tagger.tagSentence(word.lemma)[0];
      }
    }
    let res = word.normal.match(/[a-z]+/);
    if (res && res[0].length === word.normal.length) {
      wordDict.push(word);
    }
  });
  const myFrequencyDict = [];
  wordDict.sort((a, b) => {
    if (a.normal < b.normal) {
      return -1;
    }
    if (a.normal > b.normal) {
      return 1;
    }
    return 0;
  });

  let wordMap = new Map();
  let posMap = new Map();
  let lemmaMap = new Map();
  wordDict.forEach((word) => {
    let lemmaTag = tagsMapper[word.pos];
    if (wordMap.has(word.normal)) {
      let value = wordMap.get(word.normal);
      wordMap.set(word.normal, ++value);
      let tagArr = posMap.get(word.normal).split(" ");
      for (let i = 0; i < tagArr.length; i++) {
        if (tagArr[i] === word.pos) {
          break;
        }
        if (i === tagArr.length - 1) {
          tagArr.push(word.pos);
          break;
        }
      }
      posMap.set(word.normal, tagArr.join(" "));
    } else {
      if (lemmaTag === 'NN' || lemmaTag === 'NP') {
        lemmaMap.set(word.normal, lemmatize.noun(word.normal));
      } else {
        if (lemmaTag === 'JJ' || lemmaTag === 'RB') {
          lemmaMap.set(word.normal, lemmatize.adjective(word.normal));
        } else {
          if (lemmaTag === 'VB') {
            lemmaMap.set(word.normal, lemmatize.verb(word.normal));
          } else {
            if (word.lemma) {
              lemmaMap.set(word.normal, word.lemma);
            } else {
              lemmaMap.set(word.normal, word.normal);
            }
          }
        }
      }
      wordMap.set(word.normal, 1);
      posMap.set(word.normal, word.pos);
    }
  });
  wordMap.forEach((value, key) => {
    const tmpObj = {
      key: key,
      value: value,
      path: path,
      name: name,
      lemma: lemmaMap.get(key)
    };
    let brillTags = brill[key];
    let wordTags = posMap.get(key).split(" ");
    let result = new Set();
    for (let tag in brillTags) {
      result.add(brillTags[tag]);
    }
    wordTags.forEach((tag) => {
      result.add(tag);
    });
    tmpObj.tags = Array.from(result);
    let lemmaTagsSet = new Set();
    tmpObj.tags.forEach(tag => {
      if (tagsMapper[tag]) {
        lemmaTagsSet.add(tagsMapper[tag]);
      }
    });
    tmpObj.lemmaTags = Array.from(lemmaTagsSet);
    myFrequencyDict.push(tmpObj);

  });
  return myFrequencyDict;
}

function updateDictionary(dict, path, name) {
  let myFrequencyDict = formDictionary(dict, path, name);
  let prom = [];
  myFrequencyDict.forEach((word) => {
    prom.push(checkWord(word));
  });
  return Promise.all(prom);
}

function checkWord(word) {
  return Dictionary.findOne({word: word.key})
    .then((result) => {
      if (!result) {
        result = new Dictionary({
          word: word.key,
          tags: word.tags,
          lemma: word.lemma,
          lemmaTags: word.lemmaTags,
          settings: [
            {
              frequency: word.value,
              textPath: word.path,
              textName: word.name
            }
          ]
        });
        return result.save();
      } else {
        if (result) {
          if (!contains(result.settings, word.name)) {
            return Dictionary.updateOne({word: word.key}, {
              $push: {
                settings: {
                  frequency: word.value,
                  textPath: word.path,
                  textName: word.name
                }
              }
            })
          }
        }
      }
    })
}

function getAllDictionary() {
  let myDict = [];
  return Dictionary.find({}).then((dict) => {
    dict.forEach((word) => {
      let tmp = {
        key: word.word,
        value: 0,
        tags: word.tags,
        lemma: word.lemma,
        lemmaTags: word.lemmaTags,
        settings: word.settings
      };
      word.settings.forEach(value => {
        tmp.value += value.frequency;
      });
      myDict.push(tmp);
    });
    return myDict;
  });
}

function contains(a, obj) {
  for (let i = 0; i < a.length; i++) {
    if (a[i].textName === obj) {
      return true;
    }
  }
  return false;
}

function updateWordInDictionary(oldWord, newWord) {
  return Dictionary.findOne({word: oldWord}).then((oldDictWord) => {
    let oldWordSettings = oldDictWord.settings;
    return Dictionary.deleteOne({word: oldWord}).then(() => {
      return Dictionary.findOne({word: newWord}).then((newDictWord) => {
        if (newDictWord) {
          oldWordSettings.forEach((item) => {
            for (let i = 0; i < newDictWord.settings.length; i++) {
              if (newDictWord.settings[i].textName === item.textName) {
                newDictWord.settings[i].frequency += item.frequency;
                break;
              }
              if (i === newDictWord.settings.length - 1) {
                newDictWord.settings.push(item);
                break;
              }
            }
          });
        } else {
          newDictWord = new Dictionary({
            word: newWord,
            tags: brill[newWord],
            lemma: '',
            lemmaTags: [],
            settings: oldWordSettings
          });
        }

        return newDictWord.save();
      })
    })
  });

}

function addNewWord(word) {
  let newDictWord = new Dictionary({
    word: word,
    tags: brill[word],
    lemma: '',
    lemmaTags: [],
    settings: [{
      frequency: 0,
      textPath: '',
      textName: ''
    }]
  });
  return newDictWord.save();
}

function deleteTag(word, tag, isWord) {
  return Dictionary.findOne({word: word}).then(dictWord => {
    if (isWord) {
      let newTags = dictWord.tags.filter(wordTag => {
        return wordTag !== tag;
      });
      return Dictionary.updateOne({'_id': dictWord._id}, {$set: {tags: newTags}}).then(() => {
        return newTags;
      })
    } else {
      let newTags = dictWord.lemmaTags.filter(wordTag => {
        return wordTag !== tag;
      });
      return Dictionary.updateOne({'_id': dictWord._id}, {$set: {lemmaTags: newTags}}).then(() => {
        return newTags;
      })
    }
  });
}

function addTag(word, tag) {
  return Dictionary.findOne({word: word}).then(dictWord => {
    dictWord.tags.push(tag);
    tagsMapper[tag] ? dictWord.lemmaTags.push(tagsMapper[tag]) : null;
    return Dictionary.updateOne({'_id': dictWord._id}, {$set: {tags: dictWord.tags}}).then(() => {
      return Dictionary.updateOne({'_id': dictWord._id}, {$set: {lemmaTags: dictWord.lemmaTags}}).then(() => {
        let res = [];
        res.push(dictWord.tags);
        res.push(dictWord.lemmaTags);
        return res;
      });
    })
  });
}
