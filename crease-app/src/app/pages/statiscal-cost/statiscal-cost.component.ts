import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'statiscal-cost',
  templateUrl: './statiscal-cost.component.html',
})
export class StatiscalCostComponent {
  isToastOpen = false;
  messageToast = '';
  typeShow = 1;
  month = 1;
  year = 2023;
  startDate: any;
  endDate: any;
  setOpen(open: boolean) {
    this.isToastOpen = open;
  }
  loadData() {}
  statistic() {
    if (this.typeShow == 1) {
      let date = moment().format('YYYY') + '/' + this.month;
      this.startDate = moment(date).startOf('month').format('YYYYMMDD');
      this.endDate = moment(date).endOf('month').format('YYYYMMDD');
    } else if (this.typeShow == 2) {
      this.startDate = moment(this.year.toString())
        .startOf('year')
        .format('YYYYMMDD');
      this.endDate = moment(this.year.toString())
        .endOf('year')
        .format('YYYYMMDD');
    } else {
      this.startDate = moment('2021').startOf('year').format('YYYYDDMM');
      this.endDate = moment().format('YYYYDDMM');
    }
    this.loadData();
  }
}
