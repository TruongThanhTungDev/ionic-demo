import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LocalStorageService } from 'ngx-webstorage';
import { DanhMucService } from 'src/app/danhmuc.services';
import * as Highcharts from 'highcharts';
import { LoadingController } from '@ionic/angular';
import { Plugin } from 'src/app/plugins/plugins';
@Component({
  selector: 'statiscal-cost',
  styleUrls: ['./statiscal-cost.component.scss'],
  templateUrl: './statiscal-cost.component.html',
})
export class StatiscalCostComponent implements OnInit, AfterViewInit {
  DATA_URL = '/api/v1/data';
  REQUEST_URL = '/api/v1/statistics-general/statistic-cost';
  SHOP_URL = '/api/v1/shop';
  isToastOpen = false;
  messageToast = '';
  typeShow = 1;
  month = parseInt(moment().format('M'));
  year: any;
  startDate: any;
  endDate: any;
  info: any;
  shopCode = '';
  shopList: any;
  chartOptions: any;
  listChart: any;
  shop: any;
  listCheck = [true, true, false, false, false];
  tongChiPhi = 0;
  chiPhiMKT = 0;
  chiPhiVanHanh = 0;
  chiPhiVanChuyen = 0;
  chiPhiKhac = 0;
  plugins = new Plugin();
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
      this.shop = this.localStorage.retrieve('shop')
        ? this.localStorage.retrieve('shop')
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
      .get(
        this.REQUEST_URL +
          '?startDate=' +
          this.startDate +
          '&endDate=' +
          this.endDate +
          '&shop=' +
          this.shop.id +
          '&type=' +
          this.typeShow
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          this.loading.dismiss();
          if (res.body) {
            if (res.body.CODE === 200) {
              this.listChart = res.body.RESULT;
              this.customsData(this.listChart);
            } else {
              this.isToastOpen = true;
              this.messageToast = res.body.MESSAGE;
            }
          } else {
            this.isToastOpen = true;
            this.messageToast = 'Có lỗi xảy ra, vui lòng thử lại';
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

  customsData(list: any) {
    this.tongChiPhi = 0;
    this.chiPhiMKT = 0;
    this.chiPhiVanHanh = 0;
    this.chiPhiVanChuyen = 0;
    this.chiPhiKhac = 0;
    const listTongCP = [];
    const listCPMKT = [];
    const listCPVanHanh = [];
    const listCPVanChuyen = [];
    const listCPKhac = [];
    const listSubTitle = [];
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        this.chiPhiMKT += list[i].mktCost ? list[i].mktCost : 0;
        this.chiPhiVanHanh += list[i].operatingCost ? list[i].operatingCost : 0;
        this.chiPhiVanChuyen += list[i].shippingCost ? list[i].shippingCost : 0;
        this.chiPhiKhac += list[i].otherCost ? list[i].otherCost : 0;
        this.tongChiPhi +=
          (list[i].mktCost ? list[i].mktCost : 0) +
          (list[i].operatingCost ? list[i].operatingCost : 0) +
          (list[i].shippingCost ? list[i].shippingCost : 0) +
          (list[i].otherCost ? list[i].otherCost : 0);
        listTongCP.push(
          (list[i].mktCost ? list[i].mktCost : 0) +
            (list[i].operatingCost ? list[i].operatingCost : 0) +
            (list[i].shippingCost ? list[i].shippingCost : 0) +
            (list[i].otherCost ? list[i].otherCost : 0)
        );
        listCPMKT.push(list[i].mktCost ? list[i].mktCost : 0);
        listCPVanHanh.push(list[i].operatingCost ? list[i].operatingCost : 0);
        listCPVanChuyen.push(list[i].shippingCost ? list[i].shippingCost : 0);
        listCPKhac.push(list[i].otherCost ? list[i].otherCost : 0);
        listSubTitle.push(
          list[i].date
            ? this.typeShow != 1
              ? list[i].date
              : moment(list[i].date, 'YYYYMMDD').format('DD/MM')
            : 'null'
        );
      }
      this.chart(
        listTongCP,
        listCPMKT,
        listCPVanHanh,
        listCPVanChuyen,
        listCPKhac,
        listSubTitle
      );
    }
  }

  onChangeCheck(i: any): void {
    this.listCheck[i] = !this.listCheck[i];
    console.log(this.listCheck);
    this.customsData(this.listChart);
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
      this.startDate = moment('2021').startOf('year').format('YYYYMMDD');
      this.endDate = moment(this.year.toString())
        .endOf('year')
        .format('YYYYMMDD');
    }
    this.loadData();
  }

  chart(
    listTongCP: any,
    listCPMKT: any,
    listCPVanHanh: any,
    listCPVanChuyen: any,
    listCPKhac: any,
    listSubTitle: any
  ) {
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
        text: 'Thống kê chi phí',
        align: 'center',
        style: {
          color: '#006EB9',
          fontWeight: 'bold',
        },
      },

      subtitle: {},

      xAxis: {
        categories: listSubTitle,
        crosshair: true,
        scrollbar: {
          enabled: true,
        },
      },
      yAxis: {
        labels: {
          formatter: function (this: any): any {
            return _this.plugins.formatNumber(this.value/1000000)+ 'M' ;
          },
          style: {},
        },
        title: {
          text: 'Số tiền',
          style: {
            fontWeight: 'bold',
          },
        },
      },
      series: [
        {
          name: 'Tổng chi phí',
          data: _this.listCheck[0] ? listTongCP : [],
          tooltip: {
            valueSuffix: 'đ',
          },
          marker: {
            symbol: 'dot',
          },
          color: '#0187D2',
        },
        {
          name: 'Chi phí marketing',
          data: _this.listCheck[1] ? listCPMKT : [],
          tooltip: {
            valueSuffix: 'đ',
          },
          marker: {
            symbol: 'dot',
          },
          color: '#F60E1C',
        },
        {
          name: 'Chi phí vận hành',
          data: _this.listCheck[2] ? listCPVanHanh : [],
          tooltip: {
            valueSuffix: 'đ',
          },
          marker: {
            symbol: 'dot',
          },
          color: '#09AA10',
        },
        {
          name: 'Chi phí vận chuyển',
          data: _this.listCheck[3] ? listCPVanChuyen : [],
          tooltip: {
            valueSuffix: 'đ',
          },
          marker: {
            symbol: 'dot',
          },
          color: '#846E1F',
        },
        {
          name: 'Chi phí khác',
          data: _this.listCheck[4] ? listCPKhac : [],
          tooltip: {
            valueSuffix: 'đ',
          },
          marker: {
            symbol: 'dot',
          },
          color: '#9C8B8C',
        },
      ],
    };
    Highcharts.chart('chart', this.chartOptions);
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
  public async isLoading() {
    const isLoading = await this.loading.create({
      spinner: 'circles',
      keyboardClose: true,
      message: 'Đang tải',
      translucent: true,
    });
    return await isLoading.present();
  }
  handleRefresh(event: any) {
    this.loadData();
    event.target.complete();
  }
}
