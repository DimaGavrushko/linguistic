import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class TextService {

  constructor(private http: HttpClient) {
  }

  getText() {
    return this.http.get('/api/getText');
  }

}
