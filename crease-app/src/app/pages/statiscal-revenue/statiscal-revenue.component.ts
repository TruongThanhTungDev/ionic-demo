import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'statiscal-revenue-component',
  templateUrl: './statiscal-revenue.component.html',
})
export class StatiscalRevenue {
  typeShow = 1;
  optionChart = 1;
  startDate: any;
  endDate: any;
  today = new Date();
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();

  async loadData() {}

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
