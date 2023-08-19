import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { Plugin } from 'src/app/plugins/plugins';
// import Swiper core and required modules
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Swiper,
} from 'swiper';
import * as Highcharts from 'highcharts';
import { DanhMucService } from 'src/app/danhmuc.services';
import { LocalStorageService } from 'ngx-webstorage';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'dashboard-page',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Dashboard implements OnInit {
  plugins = new Plugin();
  shop: any;
  info: any;
  dateRange = {
    startDate: moment().utc().subtract(6, 'days').format('YYYY-MM-DD'),
    endDate: moment().utc().format('YYYY-MM-DD'),
  };
  refundRate = 10;
  tongCPSauHoan = 0;
  tongCP = 0;
  dashboardData: any;
  listCheck = [true, true, false, false, false];
  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private dmService: DanhMucService,
    private loading: LoadingController,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shop = this.localStorage.retrieve('shop')
      ? this.localStorage.retrieve('shop')
      : '';
  }

  ngOnInit() {
    this.getDataDashboard();
  }
  async getDataDashboard() {
    if (!this.shop) return;
    var date = JSON.parse(JSON.stringify(this.dateRange));
    date.endDate = date.endDate.replace('23:59:59', '00:00:00');
    const startDate = moment(date.startDate).format('YYYYMMDD');
    const endDate = moment(date.endDate).format('YYYYMMDD');
    await this.isLoading();
    this.dmService
      .get(
        '/api/v1/dashboard/statistic' +
          '?startDate=' +
          startDate +
          '&endDate=' +
          endDate +
          '&shopId=' +
          this.shop.id +
          '&returnRate=' +
          this.refundRate / 100
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.loading.dismiss();
            this.dashboardData = res.body.RESULT;
            this.getDataChiPhiTruocHoan(
              res.body.RESULT.statisticNetCostResponse
            );
            this.getDataChiPhi(res.body.RESULT.statisticCostResponse);
            this.getChartLineBangKeToan(res.body.RESULT.statisticsRevenueList);
          }
        },
        () => {
          this.loading.dismiss();
        },
        () => {
          this.loading.dismiss();
        }
      );
  }
  filterDate(event: any) {
    this.dateRange.startDate = event.startDate;
    this.dateRange.endDate = event.endDate;
    this.getDataDashboard();
  }
  getDataChiPhiTruocHoan(entity: any) {
    const _this = this;
    const tongChiPhi =
      entity.costPrice +
      entity.mktCost +
      entity.operatingCost +
      entity.otherCost +
      entity.shippingCost;
    this.tongCPSauHoan = tongChiPhi;
    if (tongChiPhi === 0) return;
    const giaVon = entity.costPrice;
    const mkt = entity.mktCost;
    const vanHanh = entity.operatingCost;
    const vanChuyen = entity.shippingCost;
    const khac = entity.otherCost;
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
        text:
          '<div class="text-center text-success"><span class="text-14px">Tổng chi phí sau hoàn ước tính</span> <br /><span class="bold text-20px">' +
          this.plugins.formatNumber(this.tongCPSauHoan) +
          ' đ</span></div>',
        align: 'center',
        style: {
          color: '#006EB9',
        },
        verticalAlign: 'top',
        useHTML: true,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '{point.percentage:.1f} %',
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
          type: undefined,
          data: [
            {
              name: 'Chi phí giá vốn',
              y: giaVon,
              color: '#50B332',
            },
            {
              name: 'Chi phí vận chuyển',
              y: vanChuyen,
              color: '#DDDF00',
            },
            {
              name: 'Chi phí Marketing',
              y: mkt,
              color: '#23CBE5',
            },
            {
              name: 'Chi phí vận hành',
              y: vanHanh,
              color: '#64E571',
            },
            {
              name: 'Chi phí khác',
              y: khac,
              color: '#FF9655',
            },
          ],
          showInLegend: true,
        },
      ],
    };
    Highcharts.chart('chartTongChiPhiTruocHoan', chartOption);
  }
  tinhChiPhiSauHoan(entity: any) {
    const _this = this;
    const tongChiPhi =
      entity.costPrice +
      entity.mktCost +
      entity.operatingCost +
      entity.otherCost +
      entity.shippingCost;
    this.tongCPSauHoan = tongChiPhi;
    if (tongChiPhi === 0) return;
    const giaVon = entity.costPrice;
    const mkt = entity.mktCost;
    const vanHanh = entity.operatingCost;
    const vanChuyen = entity.shippingCost;
    const khac = entity.otherCost;
  }
  getDataChiPhi(entity: any) {
    const _this = this;
    const tongChiPhi =
      entity.costPrice +
      entity.mktCost +
      entity.operatingCost +
      entity.otherCost +
      entity.shippingCost;
    this.tongCP = tongChiPhi;
    if (tongChiPhi === 0) return;
    const giaVon = entity.costPrice;
    const mkt = entity.mktCost;
    const vanHanh = entity.operatingCost;
    const vanChuyen = entity.shippingCost;
    const khac = entity.otherCost;
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
        text:
          '<div class="text-center"><span class="text-14px">Tổng chi phí</span> <br /><span class="bold text-20px">' +
          this.plugins.formatNumber(this.tongCP) +
          ' đ</span></div>',
        align: 'center',
        style: {
          color: '#006EB9',
        },
        verticalAlign: 'top',
        useHTML: true,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '{point.percentage:.1f} %',
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
          type: undefined,
          data: [
            {
              name: 'Chi phí giá vốn',
              y: giaVon,
              color: '#50B332',
            },
            {
              name: 'Chi phí vận chuyển',
              y: vanChuyen,
              color: '#DDDF00',
            },
            {
              name: 'Chi phí Marketing',
              y: mkt,
              color: '#23CBE5',
            },
            {
              name: 'Chi phí vận hành',
              y: vanHanh,
              color: '#64E571',
            },
            {
              name: 'Chi phí khác',
              y: khac,
              color: '#FF9655',
            },
          ],
          showInLegend: true,
        },
      ],
    };
    Highcharts.chart('chartTongChiPhi', chartOption);
  }
  getChartLineBangKeToan(list: any) {
    const listDoanhThu = [];
    const listChiPhi = [];
    const listLoiNhuan = [];
    const listDonChot = [];
    const listGTTB = [];
    const listSubTitle = [];
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        listDoanhThu.push(list[i].revenue ? list[i].revenue : 0);
        listChiPhi.push(
          (list[i].mktCost ? list[i].mktCost : 0) +
            (list[i].operatingCost ? list[i].operatingCost : 0) +
            (list[i].shippingCost ? list[i].shippingCost : 0) +
            (list[i].otherCost ? list[i].otherCost : 0) +
            (list[i].costPrice ? list[i].costPrice : 0)
        );
        listLoiNhuan.push(list[i].profit ? list[i].profit : 0);
        listDonChot.push(list[i].totalOrder ? list[i].totalOrder : 0);
        listGTTB.push(
          list[i].totalOrder
            ? this.rounded(list[i].revenue / list[i].totalOrder)
            : 0
        );
        listSubTitle.push(
          list[i].date
            ? moment(list[i].date, 'YYYYMMDD').format('DD/MM')
            : 'null'
        );
      }
      const _this = this;
      const chartOptionsABC: any = {
        chart: {
          zoomType: 'xy',
          style: {
            fontFamily: 'Montserrat,Helvetica Neue,Arial,sans-serif',
          },
        },
        title: {
          text: 'Bảng kết toán',
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
              return _this.plugins.formatNumber(this.value) + 'đ';
            },
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
            name: 'Doanh thu',
            data: _this.listCheck[0] ? listDoanhThu : [],
            tooltip: {
              valueSuffix: 'đ',
            },
            marker: {
              symbol: 'dot',
            },
            color: '#0564B4',
          },
          {
            name: 'Chi phí',
            data: _this.listCheck[1] ? listChiPhi : [],
            tooltip: {
              valueSuffix: 'đ',
            },
            marker: {
              symbol: 'dot',
            },
            color: '#CAAB02',
          },
          {
            name: 'Lợi nhuận',
            data: _this.listCheck[2] ? listLoiNhuan : [],
            tooltip: {
              valueSuffix: 'đ',
            },
            marker: {
              symbol: 'dot',
            },
            color: '#5C9836',
          },
          {
            name: 'Đơn đối soát',
            data: _this.listCheck[3] ? listDonChot : [],
            tooltip: {
              valueSuffix: '',
            },
            marker: {
              symbol: 'dot',
            },
            color: '#F0841F',
          },
          {
            name: 'GTTB',
            data: _this.listCheck[4] ? listGTTB : [],
            tooltip: {
              valueSuffix: 'đ',
            },
            marker: {
              symbol: 'dot',
            },
            color: '#889944',
          },
        ],
      };
      Highcharts.chart('chartBangKetToan', chartOptionsABC);
    }
  }
  onChangeCheck(i: any): void {
    this.listCheck[i] = !this.listCheck[i];
    this.getChartLineBangKeToan(this.dashboardData.statisticsRevenueList);
  }
  rounded(e: any) {
    return e ? Math.round((e + Number.EPSILON) * 100) / 100 : 0;
  }
  refreshData() {
    this.dateRange = {
      startDate: moment().utc().subtract(6, 'days').format('YYYY-MM-DD'),
      endDate: moment().utc().format('YYYY-MM-DD'),
    };
    this.getDataDashboard();
  }
  handleRefresh(event: any) {
    this.getDataDashboard();
    event.target.complete();
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
