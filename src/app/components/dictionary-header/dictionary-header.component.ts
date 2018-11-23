import {Component, EventEmitter, Input, Output} from '@angular/core';
import * as comparators from '../../comparators/comparators';
import {DictionaryService} from '../../services/dictionary.service';

@Component({
  selector: 'app-dictionary-header',
  templateUrl: './dictionary-header.component.html',
  styleUrls: ['./dictionary-header.component.css']
})
export class DictionaryHeaderComponent {

  @Output() onChangeSortVal = new EventEmitter<any>();
  @Output() onChangeDict = new EventEmitter<any>();
  @Output() onChangeOldDict = new EventEmitter<any>();
  @Input() totalDictionary: Array<{ key, value, tags, lemma, lemmaTags, settings }>;
  @Input() oldTotalDictionary: Array<{ key, value, tags, lemma, lemmaTags, settings }>;
  @Input() currentSortValue: number;
  addedWordStatus: string;
  addedWord: boolean;
  searchPattern: string;

  constructor(private dictionaryService: DictionaryService) {
    this.searchPattern = '';
    this.addedWordStatus = '';
    this.addedWord = false;
  }


  isDisabled() {
    return this.addedWord;
  }

  getTotalFrequency() {
    let sum = 0;
    this.totalDictionary.forEach((word) => {
      sum += word.value;
    });
    return sum;
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
    this.onChangeDict.emit(this.totalDictionary);
    this.onChangeOldDict.emit(this.oldTotalDictionary);
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
    this.onChangeDict.emit(this.totalDictionary);
    this.onChangeSortVal.emit(this.currentSortValue);
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
    this.onChangeDict.emit(this.totalDictionary);
    this.onChangeOldDict.emit(this.totalDictionary);
  }

  private containsInDict(word: string) {
    return this.oldTotalDictionary.some(dictWord => {
      return dictWord.key === word;
    });
  }

}
