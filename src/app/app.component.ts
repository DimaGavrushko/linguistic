import {Component} from '@angular/core';
import {DictionaryService} from './services/dictionary.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {TextService} from './services/text.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  status: string;
  myFrequencyDict: Array<{ key, value, tags, lemma, lemmaTags, settings }> = [];
  isFinished = false;
  isDictionary = true;
  isText = false;
  isStatistic = false;
  currText: any;
  currTextList: string[];

  constructor(private textService: TextService, private dictionaryService: DictionaryService, private http: HttpClient) {
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
      this.textService.getText().subscribe((text) => {
        this.currText = text;
        this.textService.getTextsList().subscribe(list => {
          this.currTextList = <string[]>list;
        });
      });
    });
  }

  updateDictionary(event) {
    this.status = 'Текст обрабатывается';
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
          this.status = 'Текст обработан';
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

          this.textService.getText().subscribe((text) => {
            this.currText = text;
            this.textService.getTextsList().subscribe(list => {
              this.currTextList = <string[]>list;
            });
          });
        });
        clearInterval(id);
      }
    }, 10000);

  }

  dictionaryVision() {
    this.isDictionary = true;
    this.isText = false;
    this.isStatistic = false;
  }

  textVision() {
    this.isDictionary = false;
    this.isText = true;
    this.isStatistic = false;
  }

  statisticVision() {
    this.isStatistic = true;
    this.isText = false;
    this.isDictionary = false;
  }
}
