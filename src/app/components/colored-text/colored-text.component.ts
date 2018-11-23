import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {TAGS} from '../TAGS';
import {TextService} from '../../services/text.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-colored-text',
  templateUrl: './colored-text.component.html',
  styleUrls: ['./colored-text.component.css']
})
export class ColoredTextComponent {

  @Input() text: any;
  @ViewChild('allContent') content: ElementRef;

  constructor(private textService: TextService) {
  }

  formTags() {
    const arr = [];
    for (const key in TAGS) {
      if (TAGS.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }

  getSelected(currTag: string, wordTag: string) {
    return currTag === wordTag;
  }


  getAllContent() {
    let myContent = '';
    for (const item of this.content.nativeElement.children) {
      for (const pair of item.children) {
        myContent += pair.innerText + '(' + pair.children[0].options[pair.children[0].selectedIndex].value + ')';
      }
    }
    const file = new File([myContent], 'myText.txt', {type: 'text/plain;charset=utf-8'});
    saveAs(file);
  }
}
