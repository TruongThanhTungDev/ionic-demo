import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import * as Highcharts from 'highcharts';
import * as dayjs from 'dayjs';
import { LoadingController } from '@ionic/angular';
import { Plugin } from 'src/app/plugins/plugins';
@Component({
  selector: 'statistics-genaral-component',
  templateUrl: './statistics-genaral.component.html',
})
export class StatisticGenaral implements OnInit {
  SHOP_URL = '/api/v1/shop';
  REQUEST_URL = '/api/v1/statistics-general';
  startDate: any;
  endDate: any;
  info: any;
  shopCode = '';
  shopList: any;
  listPieChart: any;
  dateChart: any;
  valueChart: any;
  listData: any;
  data: any;
  value: any;
  tongDoanhSo = 0;
  listStatus = [
    { id: 0, label: 'Chờ xử lý' },
    { id: 1, label: 'Đang xử lý' },
  ];
  dateRange = {
    startDate: moment().utc().subtract(6, 'days').format('YYYY-MM-DD'),
    endDate: moment().utc().format('YYYY-MM-DD'),
  };
  chartOptions: any;
  chartPieOptions: any;
  isToastOpen = false;
  messageToast = '';
  plugins = new Plugin();
  shop: any;
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
  }
  ngOnInit() {
    if (this.info.role === 'admin') {
      this.shop = this.localStorage.retrieve('shop')
        ? this.localStorage.retrieve('shop')
        : '';
      this.loadData();
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
          this.shop = this.shopList[0];
          this.loadData();
        },
        () => {
          console.error();
        }
      );
  }
  public async loadData() {
    var date = JSON.parse(JSON.stringify(this.dateRange));
    date.endDate = date.endDate.replace('23:59:59', '00:00:00');
    this.startDate = moment(date.startDate).format('YYYYMMDD');
    this.endDate = moment(date.endDate).format('YYYYMMDD');
    const params = {
      sort: ['date', 'asc'],
      page: 0,
      size: 10000,
      filter:
        'date>=' +
        this.startDate +
        ';date<=' +
        this.endDate +
        ';shop.id==' +
        this.shop.id,
    };
    await this.isLoading();
    this.dmService.query(params, this.REQUEST_URL).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.listData = res.body.RESULT.content;
            this.customData(this.listData);
          } else {
            this.loading.dismiss();
            this.isToastOpen = true;
            this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
          }
        } else {
          this.loading.dismiss();
          this.isToastOpen = true;
          this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
        }
      },
      () => {
        console.error();
        this.loading.dismiss();
        this.isToastOpen = true;
        this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
      }
    );
  }
  customData(list: any) {
    const listSubTitle = [];
    const listDoanhSo = [];
    const listDonHang = [];
    let tong = 0;
    for (let i = 0; i < list.length; i++) {
      listSubTitle.push(
        list[i].date ? moment(list[i].date, 'YYYYMMDD').format('DD/MM') : 'null'
      );
      listDoanhSo.push(list[i].sales ? list[i].sales : 0);
      listDonHang.push(list[i].totalOrder ? list[i].totalOrder : 0);
      tong += list[i].sales ? list[i].sales : 0;
    }
    this.tongDoanhSo = tong;
    this.chart(listSubTitle, listDoanhSo, listDonHang);
  }
  chart(listSubTitle: any, listDoanhSo: any, listDonHang: any) {
    const _this = this;
    this.chartOptions = {
      chart: {
        zoomType: 'xy',
        style: {
          fontFamily: 'Montserrat,Helvetica Neue,Arial,sans-serif',
        },
        scrollablePlotArea: {
          minWidth: 1000, // Độ rộng tối thiểu của khu vực cuộn
          scrollPositionX: 0, // Vị trí cuộn ban đầu (1 = cuộn đến cuối)
        },
      },
      title: {
        text: 'Thống kê doanh số',
        align: 'center',
        style: {
          color: '#006EB9',
          fontWeight: 'bold',
        },
      },
      subtitle: {
        text: '',
        align: 'left',
      },
      xAxis: [
        {
          categories: listSubTitle,
          crosshair: true,
          scrollbar: {
            enabled: true,
          },
        },
      ],
      yAxis: [
        {
          // Secondary yAxis
          title: {
            text: 'Tổng đơn hàng',
            style: {
              fontWeight: 'bold',
            },
          },
          labels: {
            formatter: function (this: any): any {
              return _this.plugins.formatNumber(this.value);
            },
            style: {},
          },
          opposite: true,
        },
        {
          // Primary yAxis
          labels: {
            formatter: function (this: any): any {
              return _this.plugins.formatNumber(this.value/1000000) + 'M';
            },
          },
          title: {
            text: 'Doanh số',
            style: {
              fontWeight: 'bold',
            },
          },
        },
      ],
      tooltip: {
        shared: true,
      },
      plotOptions: {
        column: {
            /* Here is the setting to limit the maximum column width. */
            maxPointWidth: 20
        }
     },
      series: [
        {
          name: 'Doanh số',
          type: 'column',
          yAxis: 1,
          data: listDoanhSo,
          tooltip: {
            valueSuffix: 'đ',
          },
          color: '#006EB9',
        },
        {
          name: 'Tổng đơn hàng',
          type: 'line',
          data: listDonHang,
          tooltip: {
            valueSuffix: '',
          },
          color: '#F60E1C',
        },
      ],
    };
    Highcharts.chart('chart', this.chartOptions);
  }
  filterDate(event: any) {
    this.dateRange.startDate = moment(event.startDate, 'YYYY-MM-DD').format(
      'YYYYMMDD'
    );
    this.dateRange.endDate = moment(event.endDate, 'YYYY-MM-DD').format(
      'YYYYMMDD'
    );
    this.loadData();
  }
  changeTypeShow(e: any) {
    this.shop = e.target.value;
    this.loadData();
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
  handleRefresh(event: any) {
    this.loadData();
    event.target.complete();
  }
}
