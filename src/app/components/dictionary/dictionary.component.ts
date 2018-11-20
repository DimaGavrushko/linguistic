import {Component, Input} from '@angular/core';
import {DictionaryService} from '../../services/dictionary.service';
import {TAGS} from '../TAGS';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css'],
})
export class DictionaryComponent {
  addedWord = false;
  dictionaryIndex: number;
  currentPage: number;
  searchPattern: string;
  currentSortValue: number;
  addedWordStatus: string;
  @Input() totalDictionary: Array<{ key, value, tags, lemma, lemmaTags, settings }>;
  @Input() oldTotalDictionary: Array<{ key, value, tags, lemma, lemmaTags, settings }>;

  constructor(private dictionaryService: DictionaryService) {
    this.addedWordStatus = '';
    this.searchPattern = '';
    this.currentPage = 1;
    this.dictionaryIndex = 50;
    this.currentSortValue = 1;
  }

  switchCurrentPage(increased: boolean) {
    increased ? this.currentPage++ : this.currentPage--;
  }

  setCurrentPage(n: number) {
    this.currentPage = n;
  }

  sortBy(type: number) {
    switch (type) {
      case 1:
        this.totalDictionary.sort((a, b) => {
          if (a.key < b.key) {
            return -1;
          }
          if (a.key > b.key) {
            return 1;
          }
          return 0;
        });
        break;
      case 2:
        this.totalDictionary.sort((a, b) => {
          if (b.key < a.key) {
            return -1;
          }
          if (b.key > a.key) {
            return 1;
          }
          return 0;
        });
        break;
      case 3:
        this.totalDictionary.sort((a, b) => {
          return a.value - b.value;
        });
        break;
      case 4:
        this.totalDictionary.sort((a, b) => {
          return b.value - a.value;
        });
        break;
    }
    this.currentSortValue = type;
  }

  search(word: string) {
    this.totalDictionary = [...this.oldTotalDictionary];
    if (word) {
      const newDict = [];
      this.totalDictionary.forEach((pair, i) => {
        if (pair.key.indexOf(word) !== -1) {
          newDict.push(this.totalDictionary[i]);
        }
      });
      this.totalDictionary = newDict;
      this.sortBy(this.currentSortValue);
    }
  }

  getTotalFrequency() {
    let sum = 0;
    this.totalDictionary.forEach((word) => {
      sum += word.value;
    });
    return sum;
  }

  editClick(index: number, newWord: string) {
    if (this.totalDictionary[index].key !== newWord) {
      this.dictionaryService.updateWordInDictionary(this.totalDictionary[index].key, newWord).subscribe(data => {
        this.totalDictionary = (<any>data);
        this.oldTotalDictionary = this.totalDictionary;
        console.log(this.currentSortValue);
        this.sortBy(this.currentSortValue);
      });
    }
  }

  addNewWord(word: string) {
    if (word) {
      if (!this.containsInDict(word)) {
        this.addedWord = true;
        this.addedWordStatus = 'Слово загружается';
        this.dictionaryService.addNewWord(word).subscribe(data => {
          this.totalDictionary = (<any>data);
          this.oldTotalDictionary = this.totalDictionary;
          this.sortBy(this.currentSortValue);
          this.addedWord = false;
          this.addedWordStatus = 'Слово загружено';
        });
      } else {
        this.addedWordStatus = 'Такое слово уже есть';
      }
    } else {
      this.addedWordStatus = 'Введите слово';
    }
  }

  private containsInDict(word: string) {
    return this.oldTotalDictionary.some(dictWord => {
      return dictWord.key === word;
    });
  }

  isDisabled() {
    return this.addedWord;
  }

  showHint(tags: Array<string>) {
    let hint = '';
    tags.forEach(tag => {
      hint += tag + '-' + TAGS[tag] + '\n';
    });
    return hint;
  }

  deleteTag(wordIndex: number, tagIndex: number, isWord: boolean) {
    const word = this.totalDictionary[wordIndex].key;
    const tag = isWord ? this.totalDictionary[wordIndex].tags[tagIndex] : this.totalDictionary[wordIndex].lemmaTags[tagIndex];
    this.dictionaryService.deleteTag(word, tag, isWord).subscribe(data => {
      if (isWord) {
        this.totalDictionary[wordIndex].tags = (<any>data);
      } else {
        this.totalDictionary[wordIndex].lemmaTags = (<any>data);
      }
    });
  }

  addTag(wordIndex: number, tag: string) {
    if (tag !== 'Выберите тэг') {
      const word = this.totalDictionary[wordIndex].key;
      this.dictionaryService.addTag(word, tag).subscribe(data => {
        this.totalDictionary[wordIndex].tags = (<any>data[0]);
        this.totalDictionary[wordIndex].lemmaTags = (<any>data[1]);
      });
    }
  }


  formTags(tags: Array<string>) {
    const arr = [];
    if (tags.length !== 0) {
      for (const key in TAGS) {
        if (TAGS.hasOwnProperty(key)) {
          for (let i = 0; i < tags.length; i++) {
            if (tags[i] === key) {
              break;
            }
            if (i === tags.length - 1) {
              arr.push({key: key, value: TAGS[key]});
            }
          }
        }
      }
    } else {
      for (const key in TAGS) {
        if (TAGS.hasOwnProperty(key)) {
          arr.push({key: key, value: TAGS[key]});
        }
      }
    }
    return arr;
  }

}
