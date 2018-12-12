import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class TextService {

  constructor(private http: HttpClient) {
  }

  getText() {
    return this.http.get('/api/getText');
  }

  getTextsList() {
    return this.http.get('/api/getTextsList');
  }

  getColoredText(fileName: string) {
    return this.http.get('/api/getColoredText?name=' + fileName);
  }

  updateColoredText(fileName: string, newText: any) {
    return this.http.post('/api/updateColoredText', {fileName: fileName, newText: newText});
  }

  getAllStatistic() {
    return this.http.get('/api/getAllStatistic');
  }

}
