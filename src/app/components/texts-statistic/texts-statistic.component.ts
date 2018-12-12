import {Component} from '@angular/core';
import {TextService} from '../../services/text.service';
import {tagsMas} from '../TAGS';
import {compareByFrequencyDec, compareByFrequencyInc, compareByWordTagDec, compareByWordTagInc} from '../../comparators/comparators';

@Component({
  selector: 'app-texts-statistic',
  templateUrl: './texts-statistic.component.html',
  styleUrls: ['./texts-statistic.component.css']
})
export class TextsStatisticComponent {

  tagMas = tagsMas;
  statistic: { tagStatistic, wordTagStatistic, tagTagStatistic };

  constructor(private textService: TextService) {
    this.textService.getAllStatistic().subscribe(ans => {
      this.statistic = <any>ans;
    });
  }

  sortBy(key: number) {
    switch (key) {
      case 1:
        this.statistic.tagStatistic.sort(compareByFrequencyInc);
        break;
      case 2:
        this.statistic.tagStatistic.sort(compareByFrequencyDec);
        break;
      case 3:
        this.statistic.wordTagStatistic.sort(compareByFrequencyInc);
        break;
      case 4:
        this.statistic.wordTagStatistic.sort(compareByFrequencyDec);
        break;

      case 5:
        this.statistic.wordTagStatistic.sort(compareByWordTagInc);
        break;

      case 6:
        this.statistic.wordTagStatistic.sort(compareByWordTagDec);
        break;
    }
  }

}
