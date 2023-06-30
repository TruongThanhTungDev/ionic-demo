import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import * as Highcharts from 'highcharts';
import * as dayjs from 'dayjs';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'statiscal-revenue-component',
  templateUrl: './statiscal-revenue.component.html',
})
export class StatiscalRevenue implements OnInit {
  SHOP_URL = '/api/v1/shop';
  REQUEST_URL = '/api/v1/data';
  typeShow = 1;
  optionChart = 1;
  startDate: any;
  endDate: any;
  today = new Date();
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();
  info: any;
  shopCode = '';
  shopList: any;
  listPieChart: any;
  dateChart: any;
  valueChart: any;
  listData: any;
  data: any;
  value: any;
  moi = 0;
  dangXuLy = 0;
  thatBai = 0;
  thanhCong = 0;
  refundRate = 0;
  listStatus = [
    { id: 0, label: 'Chờ xử lý' },
    { id: 1, label: 'Đang xử lý' },
  ];
  dateRange = {
    startDate: dayjs().startOf('month'),
    endDate: dayjs().endOf('month'),
  };
  chartOptions: any;
  chartPieOptions: any;
  isToastOpen = false;
  messageToast = '';
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
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
  public async loadData() {
    this.moi = 0;
    this.dangXuLy = 0;
    this.thatBai = 0;
    this.thanhCong = 0;
    await this.isLoading();
    this.dmService
      .getOption(
        null,
        this.REQUEST_URL,
        '/statisticdatabydateandstatus?startDate=' +
          this.startDate +
          '&endDate=' +
          this.endDate +
          '&shopCode=' +
          this.shopCode
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.loading.dismiss();
            this.listPieChart = res.body.RESULT;
            for (let item of this.listPieChart) {
              if (item.status == 0) {
                this.moi += item.count;
              } else if (
                item.status == 2 ||
                item.status == 3 ||
                item.status == 4 ||
                item.status == 5 ||
                item.status == 1 ||
                item.status == 9
              ) {
                this.dangXuLy += item.count;
              } else if (item.status == 6) {
                this.thatBai += item.count;
              } else {
                this.thanhCong += item.count;
              }
            }
            this.loadDataChart();
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Không có dữ liệu, vui lòng thử lại';
          }
        },
        () => {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
          console.error();
        }
      );
    if (this.optionChart == 1) {
      this.data = ' Doanh thu';
      this.value = 'Theo Doanh thu';
      this.dmService
        .getOption(
          null,
          this.REQUEST_URL,
          '/thongkedoanhthutheongay?startDate=' +
            this.startDate +
            '&endDate=' +
            this.endDate +
            '&shopCode=' +
            this.shopCode
        )
        .subscribe(
          (res: HttpResponse<any>) => {
            this.listData = res.body.RESULT;
            setTimeout(() => {
              this.loadDataChart();
            }, 200);
          },
          () => {
            console.error();
          }
        );
    } else {
      this.data = ' theo UTM';
      this.value = 'Theo Doanh thu';
      var date = JSON.parse(JSON.stringify(this.dateRange));
      date.endDate = date.endDate.replace('23:59:59', '00:00:00');
      this.startDate = moment(date.startDate).format('YYYYMMDD');
      this.endDate = moment(date.endDate).format('YYYYMMDD');
      this.dmService
        .getOption(
          null,
          this.REQUEST_URL,
          '/thongkeutm?startDate=' +
            this.startDate +
            '&endDate=' +
            this.endDate +
            '&shopCode=' +
            this.shopCode
        )
        .subscribe(
          (res: HttpResponse<any>) => {
            this.listData = res.body.RESULT;
            setTimeout(() => {
              this.loadDataChart();
            }, 200);
          },
          () => {
            console.error();
          }
        );
    }
  }
  public loadDataChart() {
    this.dateChart = [];
    this.valueChart = [];
    if (this.optionChart == 1) {
      if (this.typeShow == 1) {
        let date = moment().format('YYYY') + '/' + this.month;
        let numOfDay = parseInt(moment(date).endOf('month').format('DD'));
        for (let i = 0; i < numOfDay; i++) {
          this.dateChart.push(this.formatDay(i + 1));
          this.valueChart.push(0);
          for (let item of this.listData) {
            if (
              this.dateChart[i] ==
              item.date.toString().slice(6) +
                '/' +
                item.date.toString().slice(4, 6) +
                '/' +
                item.date.toString().slice(0, 4)
            ) {
              this.valueChart[i] =
                (this.valueChart[i] + item.revenue) *
                (1 - this.refundRate / 100.0);
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
            if (item.date == this.formatMonth(i.date)) {
              item.value = item.value + i.revenue;
            }
          }
        }
        for (let item of results) {
          this.dateChart.push(item.date);
          this.valueChart.push(item.value);
        }
        this.valueChart = this.valueChart.map(
          (item: any) => item * (1 - this.refundRate / 100.0)
        );
        this.createChart();
      } else {
        let temp = [];
        for (let item of this.listData) {
          temp.push(this.formatYear(item.date));
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
            if (item.date == this.formatYear(i.date)) {
              item.value = item.value + i.revenue;
            }
          }
        }
        for (let item of results) {
          this.dateChart.push(item.date);
          this.valueChart.push(item.value);
        }
        this.createChart();
      }
    } else {
      let mocks = [];
      for (let item of this.listData) {
        mocks.push(item.utmMedium);
      }
      let set = new Set(mocks);
      this.dateChart = [...set];
      let countList = [];
      let avgList = [];
      for (let i = 0; i < this.dateChart.length; i++) {
        this.valueChart.push(0);
        countList.push(0);
        avgList.push(0);
        for (let item of this.listData) {
          if (this.dateChart[i] == item.utmMedium) {
            this.valueChart[i] = this.valueChart[i] + item.price;
            countList[i] = countList[i] + item.count;
          }
        }
        this.createChart();
      }
      for (let i = 0; i < this.dateChart.length; i++) {
        let item = {
          utm: this.dateChart[i],
          price: this.valueChart[i],
          count: countList[i],
          price_order: parseInt((this.valueChart[i] / countList[i]).toFixed(0)),
        };
      }
    }
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
  formatMonth(date: any) {
    let dateValue = 'Tháng ' + date.toString().slice(4, 6);
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
    this.chartPieOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: undefined,
      },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>',
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemMarginBottom: 20,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f} %',
            distance: -30,
            style: {
              fontWeight: 'bold',
              color: 'white',
            },
          },
        },
      },
      series: [
        {
          name: 'Brands',
          colorByPoint: true,
          data: [
            {
              name: 'Đã thành công',
              y: this.thanhCong,
            },
            {
              name: 'Đã hủy',
              y: this.thatBai,
            },
            {
              name: 'Mới',
              y: this.moi,
            },
            {
              name: 'Xử lý',
              y: this.dangXuLy,
            },
          ],
          showInLegend: true,
        },
      ],
    };

    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: undefined,
      },
      credits: {
        enabled: false,
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
          name: this.data,
          data: this.valueChart,
        },
      ],
    };
    this.chartOptions.series.setVisible;
    if (
      this.listPieChart &&
      this.listPieChart.length &&
      this.valueChart &&
      this.valueChart.length
    ) {
      Highcharts.chart('pie-chart', this.chartPieOptions);
      Highcharts.chart('chart', this.chartOptions);
    }
  }
  public formatCurrency(value: number): String {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
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
  setOpen(open: boolean) {
    this.isToastOpen = open;
  }
}
