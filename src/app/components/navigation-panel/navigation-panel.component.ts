import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.css']
})
export class NavigationPanelComponent {

  @Input() currentPage: number;

  constructor() {
  }


  switchCurrentPage(increased: boolean) {
    increased ? this.currentPage++ : this.currentPage--;
  }

  setCurrentPage(n: number) {
    this.currentPage = n;
  }

}
