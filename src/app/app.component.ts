import {Component} from '@angular/core';
import {DictionaryService} from './services/dictionary.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  status: string;
  myFrequencyDict: Array<{ key, value, tags, lemma, lemmaTags, settings }> = [];
  isVisible = false;
  isFinished = false;

  constructor(private dictionaryService: DictionaryService, private http: HttpClient) {
    this.status = '';
    this.dictionaryService.getAllDictionary().subscribe((ans) => {
      this.myFrequencyDict = <any>ans;
      this.myFrequencyDict.sort((a, b) => {
        if (a.key < b.key) {
          return -1;
        }
        if (a.key > b.key) {
          return 1;
        }
        return 0;
      });
      this.isVisible = true;
    });
  }

  updateDictionary(event) {
    this.status = 'Словарь загружается';
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      const params = new HttpParams();
      formData.append('uploadFile', file);
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      const options = {
        headers: headers,
        responseType: 'text',
        params: params,
        reportProgress: true,
        withCredentials: true,
      };
      this.dictionaryService.updateDictionary(formData, options)
        .subscribe(() => {
            this.isFinished = false;
            this.check();
          }
        );
    }
  }

  check() {
    const id = setInterval(() => {
      this.http.get('/api/isFinished').subscribe((ans) => {
        this.isFinished = <any>ans;

      });
      if (this.isFinished) {
        this.dictionaryService.getAllDictionary().subscribe((ans) => {
          this.status = 'Словарь загружен';
          this.myFrequencyDict = <any>ans;
          this.myFrequencyDict.sort((a, b) => {
            if (a.key < b.key) {
              return -1;
            }
            if (a.key > b.key) {
              return 1;
            }
            return 0;
          });
        });
        clearInterval(id);
      }
    }, 10000);

  }

}
