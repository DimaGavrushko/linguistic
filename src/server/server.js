const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const formidable = require('express-formidable');
const mongoose = require('mongoose');
const dictionaryServices = require('./services/dictionary.service');
const textServices = require('./services/text.service');

const form = formidable();
const jsonParser = bodyParser.json();
let myCurrFile = {
  data: null,
  name: ''
};
app.listen(3000, () => console.log(`server is running...`));


mongoose.connect(`mongodb://localhost:27017`, {useNewUrlParser: true}, function (err) {
  if (err) throw err;
  console.log('Successfully connected to database');
});


app.post('/api/updateDictionary', form, (req, res) => {
  fs.readFile(req.files.uploadFile.path, 'utf8', function (err, data) {
    myCurrFile.data = data;
    myCurrFile.name = req.files.uploadFile.name;
    updateDictionary(data, req.files.uploadFile.path, req.files.uploadFile.name);
    res.send();
  })
});

app.get('/api/getText', (req, res) => {
  if (myCurrFile.data) {
    textServices.formText(myCurrFile).then(ans => res.send(ans));
  } else {
    res.send(null);
  }
  myCurrFile = {
    data: null,
    name: ''
  };
});

app.get('/api/getTextsList', (req, res) => {
  textServices.getTextsList().then(ans => {
    res.send(ans);
  });
});

app.get('/api/getColoredText', (req, res) => {
  textServices.getColoredText(req.query.name).then(ans => {
    res.send(ans);
  });
});

app.post('/api/updateColoredText', jsonParser, (req, res) => {
  textServices.updateColoredText(req.body.fileName, req.body.newText).then(() => res.send());
});

app.get('/api/getAllStatistic', (req, res) => {
  textServices.getAllStatistic().then(ans => {
    res.send(ans);
  });
});

app.get('/api/getAllDictionary', (req, res) => {
  dictionaryServices.getAllDictionary().then(rest => {
    res.send(rest);
  });
});

app.post('/api/updateWordInDictionary', jsonParser, (req, res) => {
  dictionaryServices.updateWordInDictionary(req.body.oldWord, req.body.newWord, req.body.fileName).then(() => {
    dictionaryServices.getAllDictionary().then((rest) => {
      res.send(rest);
    })
  })
});

app.get('/api/isFinished', (req, res) => {
  res.send(isFinished);
});

app.post('/api/addNewWord', jsonParser, (req, res) => {
  dictionaryServices.addNewWord(req.body.word).then(() => {
    dictionaryServices.getAllDictionary().then(rest => {
      res.send(rest);
    })
  })
});

app.post('/api/deleteTag', jsonParser, (req, res) => {
  dictionaryServices.deleteTag(req.body.word, req.body.tag, req.body.isWord).then((newTags) => {
    res.send(newTags);
  })
});

app.post('/api/addTag', jsonParser, (req, res) => {
  dictionaryServices.addTag(req.body.word, req.body.tag).then((newTags) => {
    res.send(newTags);
  })
});


let isFinished = false;

function updateDictionary(data, path, name) {
  isFinished = false;
  dictionaryServices.updateDictionary(data, path, name).then(() => {
    isFinished = true;
  })
}
