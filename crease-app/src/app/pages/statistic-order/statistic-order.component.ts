import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import * as Highcharts from 'highcharts';
import * as dayjs from 'dayjs';
import { LoadingController } from '@ionic/angular';
import { Plugin } from 'src/app/plugins/plugins';
import { TooltipFormatterContextObject } from 'highcharts/highcharts.src';
@Component({
  selector: 'statistic-order-component',
  styleUrls: ['./statistic-order.component.scss'],
  templateUrl: './statistic-order.component.html',
})
export class StatisticOrderComponent implements OnInit {
  chartOptions: any;

  listData: any = [];
  listTK = [];
  taiKhoan: any;
  dateChart = [];
  valueChart = [];
  optionChart = 1;
  chartPieOptions: any;
  dataAdapter: any;
  shop: any;
  REQUEST_URL = '/api/v1/statistics-general';
  REQUEST_URL_TK = '/api/v1/account_shipping';
  listEntity = [];
  info: any;
  selectedEntity: any;
  data = '';
  value = '';
  tongDoanhSo = 0;
  plugins = new Plugin();
  dangChuyenKhoGiao = 0;
  dangGiaoHang = 0;
  hoanGiaoHang = 0;
  daGiaoHang = 0;
  daDoiSoat = 0;
  xacNhanHoan = 0;
  hoanTraHang = 0;
  dangChuyenKhoTra = 0;
  daTraHangToanBo = 0;
  startDate: any;
  endDate: any;
  isToastOpen = false;
  messageToast = '';

  dateRange = {
    startDate: moment().utc().format('YYYY-MM-DD'),
    endDate: moment().utc().format('YYYY-MM-DD'),
  };
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
    if (this.info.role === 'admin') {
      this.shop = this.localStorage.retrieve('shop')
        ? this.localStorage.retrieve('shop')
        : '';
      this.getTaiKhoan();
    }
  }
  ngOnInit(): void {}
  async getTaiKhoan() {
    const params = {
      sort: ['id', 'asc'],
      page: 0,
      size: 10000,
      filter: 'id>0',
    };
    await this.isLoading();
    this.dmService.query(params, this.REQUEST_URL_TK).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.loading.dismiss();
          this.listTK = res.body.RESULT.content;
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
  async loadData() {
    await this.isLoading();
    var date = JSON.parse(JSON.stringify(this.dateRange));
    let startDate = moment(date.startDate).format('YYYYMMDD') + '000000';
    let endDate = moment(date.endDate).format('YYYYMMDD') + '235959';
    const entity = {
      accountShippingId: this.taiKhoan ? this.taiKhoan.id : null,
      endDate: this.endDate,
      startDate: this.startDate,
      shopId: this.shop.id,
    };
    this.dmService.postOption(entity, '/api/v1/statistics/data', '').subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.loading.dismiss();
          this.listData = res.body.RESULT;
          this.getTrangThai(this.listData.statisticsDataResponseList);
          this.chartXuHuongLenDon(this.listData.uptrendDtos);
          this.chartTinhTrangDonHang();
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
  }
  getTrangThai(list: any): void {
    for (let i = 0; i < list.length; i++) {
      switch (list[i].status) {
        case 10: {
          this.dangChuyenKhoGiao = list[i].count;
          break;
        }
        case 13: {
          this.dangGiaoHang = list[i].count;
          break;
        }
        case 14: {
          this.hoanGiaoHang = list[i].count;
          break;
        }
        case 12: {
          this.daGiaoHang = list[i].count;
          break;
        }
        case 15: {
          this.daDoiSoat = list[i].count;
          break;
        }
        case 16: {
          this.xacNhanHoan = list[i].count;
          break;
        }
        case 17: {
          this.hoanTraHang = list[i].count;
          break;
        }
        case 18: {
          this.dangChuyenKhoTra = list[i].count;
          break;
        }
        case 19: {
          this.daTraHangToanBo = list[i].count;
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  chartTinhTrangDonHang(): void {
    const _this = this;
    if (!this.listData) {
      return;
    }
    const chartOption: any = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      legend: {
        itemMarginBottom: 10,
      },
      title: {
        text: 'Thống kê tình trạng đơn hàng',
        align: 'center',
        style: {
          color: '#006EB9',
          fontWeight: 'bold',
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.2f}%</b>',
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            formatter: function (this: any): any {
              return _this.rounded(this.point.percentage) + ' %';
            },
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
          data: [
            {
              name: 'Đã giao hàng ',
              y: _this.listData.piePercentDelivered
                ? _this.listData.piePercentDelivered
                : 0,
              color: '#47AC4F',
            },
            {
              name: 'Không giao được',
              y: _this.listData.piePercentFail
                ? _this.listData.piePercentFail
                : 0,
              color: '#FF4747',
            },
            {
              name: 'Đang xử lý',
              y: _this.listData.piePercentProcess
                ? _this.listData.piePercentProcess
                : 0,
              color: '#C8B216',
            },
          ],
          showInLegend: true,
        },
      ],
    };
    Highcharts.chart('chartTinhTrangDonHang', chartOption);
  }
  chartXuHuongLenDon(list: any): void {
    const _this = this;
    if (list.length === 0) {
      return;
    }
    const date = [];
    const value = [];
    for (let i = 0; i < list.length; i++) {
      date.push(
        list[i].date ? moment(list[i].date, 'YYYYMMDD').format('DD/MM') : 'null'
      );
      value.push(list[i].count ? list[i].count : 0);
    }
    const min_width = 500 + date.length * 35;
    const chartOption: any = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'column',
        scrollablePlotArea: {
          minWidth: 1000, // Độ rộng tối thiểu của khu vực cuộn
          scrollPositionX: 0, // Vị trí cuộn ban đầu (1 = cuộn đến cuối)
        },
      },
      legend: {
        itemMarginBottom: 10,
      },
      title: {
        text: 'Xu hướng lên đơn',
                align: 'center',
                style: {
                    color: '#006EB9',
                    fontWeight: 'bold'
                }
      },
      xAxis: {
        categories: date,
        crosshair: true,
        scrollbar: {
          enabled: true,
        },
        title: {
          enabled:false
      }
      },
      yAxis: {
        labels: {
          // formatter: () => {
          //   return this.formatNumber(this.value) + 'đ';
          // },
        },
        title: {
          title: {
            enabled:false
        }
        },
      },

      credits: {
        enabled: false,
      },
      tooltip: {
        formatter: function (this: any): any {
          return _this.plugins.formatNumber(this.y) + 'đ';
        },
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
      series: [{
        name: 'Đơn hàng',
        data: value,
        tooltip: {
            valueSuffix: ''
        },
        color: '#006EB9',
        dataLabels:{
            enabled:true
        }
    
     }],
    };
    Highcharts.chart('chartXuHuongLenDon', chartOption);
  }
  rounded(e: number) {
    return e ? Math.round((e + Number.EPSILON) * 100) / 100 : 0;
  }
  filterDate(e: any) {
    this.dateRange.startDate = moment(e.startDate, 'YYYY-MM-DD').format(
      'YYYY-MM-DD'
    );
    this.dateRange.endDate = moment(e.endDate, 'YYYY-MM-DD').format(
      'YYYY-MM-DD'
    );
    this.loadData();
  }
  setOpen(open: boolean) {
    this.isToastOpen = open;
  } 
  public formatNumber(number: any) {
    return Number(number) ? Number(number).toLocaleString("vi-VN") : 0;
  }
  refreshData() {
    this.dateRange = {
      startDate: moment().utc().subtract(6, 'days').format('YYYY-MM-DD'),
      endDate: moment().utc().format('YYYY-MM-DD'),
    };
    this.loadData();
  }
  handleRefresh(event: any) {
    this.loadData();
    event.target.complete();
  }
}
