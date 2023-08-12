import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private dmService: DanhMucService
  ) {
    this.info = this.localStorage.retrieve('authenticationToken');
    this.shop = this.localStorage.retrieve('shop')
      ? this.localStorage.retrieve('shop')
      : '';
  }

  ngOnInit() {
    this.getDataDashboard();
  }
  getDataDashboard() {
    if (!this.shop) return;
    var date = JSON.parse(JSON.stringify(this.dateRange));
    date.endDate = date.endDate.replace('23:59:59', '00:00:00');
    const startDate = moment(date.startDate).format('YYYYMMDD');
    const endDate = moment(date.endDate).format('YYYYMMDD');
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
            this.dashboardData = res.body.RESULT;
            this.getDataChiPhiTruocHoan(
              res.body.RESULT.statisticNetCostResponse
            );
            this.getDataChiPhi(res.body.RESULT.statisticCostResponse);
            this.getChartLineBangKeToan();
          }
        },
        () => {},
        () => {}
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
  getChartLineBangKeToan() {
    const chartOption: any = {
      title: {
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: 'Number of Employees',
        },
      },

      xAxis: {
        accessibility: {
          rangeDescription: 'Range: 2010 to 2020',
        },
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 2010,
        },
      },

      series: [
        {
          name: 'Doanh thu',
          data: [
            43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
            161454, 154610,
          ],
        },
        {
          name: 'Chi phí',
          data: [
            24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726,
            34243, 31050,
          ],
        },
        {
          name: 'Lợi nhuận',
          data: [
            11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243,
            29213, 25663,
          ],
        },
        {
          name: 'Đơn đối soát',
          data: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            11164,
            11218,
            10077,
          ],
        },
        {
          name: 'GTTB',
          data: [
            21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906,
            10073,
          ],
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    };
    Highcharts.chart('bang-ke-toan', chartOption);
  }
  rounded(e: number) {
    return e ? Math.round((e + Number.EPSILON) * 100) / 100 : 0;
  }
}
