import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import * as Highcharts from 'highcharts';
import * as HighchartsMore from 'highcharts/highcharts-more';
import * as HighchartsExporting from 'highcharts/modules/exporting';
import * as HighchartsExportData from 'highcharts/modules/export-data';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'statiscal-cost',
  templateUrl: './statiscal-cost.component.html',
})
export class StatiscalCostComponent implements OnInit, AfterViewInit {
  DATA_URL = '/api/v1/data';
  REQUEST_URL = '/api/v1/cost';
  SHOP_URL = '/api/v1/shop';
  isToastOpen = false;
  messageToast = '';
  typeShow = 1;
  month = 1;
  year: any;
  startDate: any;
  endDate: any;
  info: any;
  shopCode = '';
  shopList: any;
  listData: any;
  dataList: any;
  dateChart: any;
  valueChart: any;
  selectedItem: any;
  chartOptions: any;
  isNoData = false;
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
  }
  setOpen(open: boolean) {
    this.isToastOpen = open;
  }
  ngOnInit() {
    if (this.info.role === 'admin') {
      this.shopCode = this.localStorage.retrieve('shop')
        ? this.localStorage.retrieve('shop').code
        : '';
      this.statistic();
    } else {
      this.loadShopList();
    }
  }
  ngAfterViewInit(): void {}
  public async loadData() {
    await this.isLoading();
    this.dmService
      .getOption(
        null,
        this.REQUEST_URL,
        '/getallcostbytimerange?startDate=' +
          this.startDate +
          '&endDate=' +
          this.endDate +
          '&shopCode=' +
          this.shopCode
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          this.listData = res.body.RESULT;
          this.dmService
            .getOption(
              null,
              this.DATA_URL,
              '/stc-cost-data?startDate=' +
                this.startDate +
                '&endDate=' +
                this.endDate +
                '&shopCode=' +
                this.shopCode
            )
            .subscribe(
              (res: HttpResponse<any>) => {
                this.loading.dismiss();
                this.dataList = res.body.RESULT;
                this.loadDataChart();
              },
              () => {
                this.dataList = [];
                this.loading.dismiss();
                console.error();
              }
            );
        },
        () => {
          console.error();
        }
      );
  }
  public loadShopList() {
    this.dmService
      .getOption(
        null,
        this.SHOP_URL,
        '/search?filter=id>0;status==1&sort=id,asc&size=1000&page=0'
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          this.shopList = res.body.RESULT.content;
          this.shopCode = this.shopList[0].code;
          this.statistic();
        },
        () => {
          console.error();
        }
      );
  }
  public loadDataChart() {
    this.dateChart = [];
    this.valueChart = [];
    if (this.typeShow == 1) {
      let totalCost = 0.0;
      let dayCostList = [];

      for (let item of this.listData) {
        if (item.fromDate == item.toDate) {
          dayCostList.push(item);
        } else {
          totalCost = totalCost + item.totalCost;
        }
      }
      let date = moment().format('YYYY') + '/' + this.month;
      let numOfDay =
        parseInt(moment(date).endOf('month').format('YYYYMMDD').slice(6)) -
        parseInt(moment(date).startOf('month').format('YYYYMMDD').slice(6)) +
        1;
      for (let i = 0; i < numOfDay; i++) {
        this.dateChart.push(this.formatDay(i + 1));
        this.valueChart.push(totalCost / numOfDay);
        for (let item of dayCostList) {
          let sum = 0;
          if (
            this.dateChart[i] ==
            item.fromDate.toString().slice(6) +
              '/' +
              item.fromDate.toString().slice(4, 6) +
              '/' +
              item.fromDate.toString().slice(0, 4)
          ) {
            this.valueChart[i] = this.valueChart[i] + item.totalCost;
          }
        }
      }
      for (let i = 0; i < this.dateChart.length; i++) {
        for (let j = 0; j < this.dataList.length; j++) {
          if (
            this.dateChart[i] ==
            this.dataList[j].date.toString().slice(6) +
              '/' +
              this.dataList[j].date.toString().slice(4, 6) +
              '/' +
              this.dataList[j].date.toString().slice(0, 4)
          ) {
            this.valueChart[i] +=
              this.dataList[j].total +
              this.dataList[j].cogs +
              this.dataList[j].totalProductValue;
          }
        }
      }
      this.createChart();
    } else if (this.typeShow == 2) {
      let results = [
        {
          date: 'Tháng 01',
          value: 0,
        },
        {
          date: 'Tháng 02',
          value: 0,
        },
        {
          date: 'Tháng 03',
          value: 0,
        },
        {
          date: 'Tháng 04',
          value: 0,
        },
        {
          date: 'Tháng 05',
          value: 0,
        },
        {
          date: 'Tháng 06',
          value: 0,
        },
        {
          date: 'Tháng 07',
          value: 0,
        },
        {
          date: 'Tháng 08',
          value: 0,
        },
        {
          date: 'Tháng 09',
          value: 0,
        },
        {
          date: 'Tháng 10',
          value: 0,
        },
        {
          date: 'Tháng 11',
          value: 0,
        },
        {
          date: 'Tháng 12',
          value: 0,
        },
      ];
      for (let item of results) {
        for (let i of this.listData) {
          if (item.date == this.formatMonth(i.fromDate)) {
            item.value = item.value + i.totalCost;
          }
        }
      }
      for (let item of results) {
        this.dateChart.push(item.date);
        this.valueChart.push(item.value);
      }
      for (let i = 0; i < this.dateChart.length; i++) {
        for (let j = 0; j < this.dataList.length; j++) {
          if (this.dateChart[i] == this.formatMonth(this.dataList[j].date)) {
            this.valueChart[i] +=
              this.dataList[j].total +
              this.dataList[j].cogs +
              this.dataList[j].totalProductValue;
          }
        }
      }
      this.createChart();
    } else {
      let temp = [];
      for (let item of this.listData) {
        temp.push(this.formatYear(item.fromDate));
      }
      let set = new Set(temp);
      let mocks = [...set];
      let results = [];
      for (let item of mocks) {
        let resultItem = {
          date: item,
          value: 0,
        };
        results.push(resultItem);
      }

      for (let item of results) {
        for (let i of this.listData) {
          if (item.date == this.formatYear(i.fromDate)) {
            item.value = item.value + i.totalCost;
          }
        }
      }
      results.forEach((item: any) => {
        this.dateChart.push(item.date);
        this.valueChart.push(item.value);
      });
      for (let i = 0; i < this.dateChart.length; i++) {
        for (let j = 0; j < this.dataList.length; j++) {
          if (this.dateChart[i] == this.formatYear(this.dataList[j].date)) {
            this.valueChart[i] +=
              this.dataList[j].total +
              this.dataList[j].cogs +
              this.dataList[j].totalProductValue;
          }
        }
      }
      this.createChart();
    }
    // }
  }
  formatDay(day: any) {
    let dateValue;
    if (this.month < 10) {
      if (day < 10) {
        dateValue =
          '0' + day + '/0' + this.month + '/' + moment().format('YYYY');
      } else {
        dateValue = day + '/0' + this.month + '/' + moment().format('YYYY');
      }
    } else {
      if (day < 10) {
        dateValue =
          '0' + day + '/' + this.month + '/' + moment().format('YYYY');
      } else {
        dateValue = day + '/' + this.month + '/' + moment().format('YYYY');
      }
    }
    return dateValue;
  }
  formatMonth(fromDate: any) {
    let dateValue = 'Tháng ' + fromDate.toString().slice(4, 6);
    return dateValue;
  }
  formatYear(fromDate: any) {
    let dateValue = 'Năm ' + fromDate.toString().slice(0, 4);
    return dateValue;
  }

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
  formatDateChart(fromDate: any, toDate: any): string {
    let dateValue =
      fromDate.toString().slice(4, 6) +
      '/' +
      fromDate.toString().slice(0, 4) +
      '-' +
      toDate.toString().slice(4, 6) +
      '/' +
      toDate.toString().slice(0, 4);
    return dateValue;
  }
  createChart(): void {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: undefined,
      },
      xAxis: {
        categories: this.dateChart,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: undefined,
        },
      },
      series: [
        {
          name: 'Chi phí',
          data: this.valueChart,
        },
      ],
    };
    this.chartOptions.series.setVisible;
    Highcharts.chart('chart', this.chartOptions);
  }
  public async isLoading() {
    const isLoading = await this.loading.create({
      spinner: 'circles',
      keyboardClose: true,
      message: 'Đang tải',
      translucent: true,
    });
    return await isLoading.present();
  }
}
