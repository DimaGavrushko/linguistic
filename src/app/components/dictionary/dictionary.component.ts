import {Component, Input} from '@angular/core';
import {DictionaryService} from '../../services/dictionary.service';
import {TAGS} from '../TAGS';
import * as comparators from '../../comparators/comparators';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css'],
})
export class DictionaryComponent {

  dictionaryIndex: number;
  currentPage: number;
  currentSortValue: number;
  @Input() totalDictionary: Array<{ key, value, tags, lemma, lemmaTags, settings }>;
  @Input() oldTotalDictionary: Array<{ key, value, tags, lemma, lemmaTags, settings }>;

  constructor(private dictionaryService: DictionaryService) {
    this.currentPage = 1;
    this.dictionaryIndex = 50;
    this.currentSortValue = 1;
  }

  getNewDict(array: any) {
    this.totalDictionary = array;
  }

  getOldDict(array: any) {
    this.oldTotalDictionary = array;
  }

  getCurrSortValue(val: number) {
    this.currentSortValue = val;
  }

  sortBy(type: number) {
    switch (type) {
      case 1:
        this.totalDictionary.sort(comparators.compareByKeyInc);
        break;
      case 2:
        this.totalDictionary.sort(comparators.compareByKeyDec);
        break;
      case 3:
        this.totalDictionary.sort(comparators.compareByValueInc);
        break;
      case 4:
        this.totalDictionary.sort(comparators.compareByValueDec);
        break;
    }
    this.currentSortValue = type;
  }

  editClick(index: number, newWord: string) {
    if (this.totalDictionary[index].key !== newWord) {
      this.dictionaryService.updateWordInDictionary(this.totalDictionary[index].key, newWord).subscribe(data => {
        this.totalDictionary = (<any>data);
        this.oldTotalDictionary = this.totalDictionary;
        this.sortBy(this.currentSortValue);
      });
    }
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
