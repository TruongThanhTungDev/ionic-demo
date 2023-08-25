import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'datepicker-component',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatePickerComponent {
  @Output() filterDate = new EventEmitter<any>();
  @Input() dateRange = {
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD'),
  };
  isOpenFilterModal = false;
  stateDate = 'from';
  range = [
    {
      name: 'Hôm nay',
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    },
    {
      name: 'Hôm qua',
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    },
    {
      name: '7 ngày qua',
      startDate: moment().subtract(6, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    },
    {
      name: '30 ngày qua',
      startDate: moment().subtract(29, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    },
    {
      name: 'Tháng này',
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').format('YYYY-MM-DD'),
    },
    {
      name: 'Tháng trước',
      startDate: moment()
        .subtract(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .subtract(1, 'month')
        .endOf('month')
        .format('YYYY-MM-DD'),
    },
    {
      name: '3 Tháng trước',
      startDate: moment()
        .subtract(3, 'month')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .subtract(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD'),
    },
  ];
  get date() {
    return (
      moment(this.dateRange.startDate).format('DD/MM/YYYY') +
      ' ~ ' +
      moment(this.dateRange.endDate).format('DD/MM/YYYY')
    );
  }
  setDate(startDate: any, endDate: any) {
    this.dateRange.startDate = startDate;
    this.dateRange.endDate = endDate;
    this.filterDate.emit(this.dateRange);
  }
  openModalFilter(open: boolean) {
    this.isOpenFilterModal = open;
  }
  changeTab(state: any) {
    this.stateDate = state;
  }
  setStartDate(e: any) {
    this.dateRange.startDate = e.target.value;
  }
  setEndDate(e: any) {
    this.dateRange.endDate = e.target.value;
  }
  setCustomDate(date: any) {
    this.isOpenFilterModal = false;
    this.filterDate.emit(date);
  }
}
