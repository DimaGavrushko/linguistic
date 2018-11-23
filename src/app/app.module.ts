import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {DictionaryService} from './services/dictionary.service';
import {HttpClientModule} from '@angular/common/http';
import {DictionaryComponent} from './components/dictionary/dictionary.component';
import {NavigationPanelComponent} from './components/navigation-panel/navigation-panel.component';
import {DictionaryHeaderComponent} from './components/dictionary-header/dictionary-header.component';
import {ColoredTextComponent} from './components/colored-text/colored-text.component';
import {TextService} from './services/text.service';



@NgModule({
  declarations: [
    AppComponent,
    DictionaryComponent,
    NavigationPanelComponent,
    DictionaryHeaderComponent,
    ColoredTextComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DictionaryService, TextService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
