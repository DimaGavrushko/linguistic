import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class DictionaryService {

  constructor(private http: HttpClient) {
  }

  updateDictionary(formData, options) {
    return this.http.post('/api/updateDictionary', formData, options);
  }

  updateWordInDictionary(oldWord: string, newWord: string) {
    const body = {
      oldWord: oldWord,
      newWord: newWord
    };
    return this.http.post('/api/updateWordInDictionary', body);
  }

  getAllDictionary() {
    return this.http.get('/api/getAllDictionary');
  }

  addNewWord(word: string) {
    return this.http.post('/api/addNewWord', {word: word});
  }

  deleteTag(word: string, tag: string, isWord: boolean) {
    return this.http.post('/api/deleteTag', {word: word, tag: tag, isWord: isWord});
  }

  addTag(word: string, tag: string) {
    return this.http.post('/api/addTag', {word: word, tag: tag});
  }
}
