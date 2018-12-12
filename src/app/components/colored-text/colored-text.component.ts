import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {TAGS} from '../TAGS';
import {saveAs} from 'file-saver';
import {TextService} from '../../services/text.service';

@Component({
  selector: 'app-colored-text',
  templateUrl: './colored-text.component.html',
  styleUrls: ['./colored-text.component.css']
})
export class ColoredTextComponent {

  @Input() textList: string[];
  @Input() text: any;
  @ViewChild('allContent') content: ElementRef;
  @Input() currTextName: string;

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
        myContent += pair.innerText.substr(0, pair.innerText.length - 1) + '_' +
          pair.children[0].options[pair.children[0].selectedIndex].value + ' ';
      }
    }
    const file = new File([myContent], 'myText.txt', {type: 'text/plain;charset=utf-8'});
    saveAs(file);
  }

  loadText(fileName: string) {
    this.textService.getColoredText(fileName).subscribe(coloredText => {
      this.text = coloredText;
    });
    this.currTextName = fileName;
  }

  updateColoredText() {
    const newText: Array<{ value, pos }> = [];
    for (const item of this.content.nativeElement.children) {
      for (const pair of item.children) {
        newText.push({
          value: pair.innerText.substr(0, pair.innerText.length - 1),
          pos: pair.children[0].options[pair.children[0].selectedIndex].value
        });
      }
    }
    if (this.currTextName) {
      this.textService.updateColoredText(this.currTextName, newText).subscribe();
    }
  }
}
