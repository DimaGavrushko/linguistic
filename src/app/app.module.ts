import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {DictionaryService} from './services/dictionary.service';
import {HttpClientModule} from '@angular/common/http';
import { DictionaryComponent } from './components/dictionary/dictionary.component';

@NgModule({
  declarations: [
    AppComponent,
    DictionaryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DictionaryService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
