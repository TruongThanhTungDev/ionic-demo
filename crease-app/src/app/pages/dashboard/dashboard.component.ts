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
  constructor(private router: Router) {}

  ngOnInit() {
    this.getDataChiPhiTruocHoan();
    this.getDataChiPhi();
    this.getChartLineBangKeToan();
  }
  getDataChiPhiTruocHoan() {
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
        text: undefined,
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
              y: 100,
              color: '#50B332',
            },
            {
              name: 'Chi phí vận chuyển',
              y: 60,
              color: '#DDDF00',
            },
            {
              name: 'Chi phí Marketing',
              y: 91,
              color: '#23CBE5',
            },
            {
              name: 'Chi phí vận hành',
              y: 24,
              color: '#64E571',
            },
            {
              name: 'Chi phí khác',
              y: 10,
              color: '#FF9655',
            },
          ],
          showInLegend: true,
        },
      ],
    };
    Highcharts.chart('chartTongChiPhiTruocHoan', chartOption);
  }
  getDataChiPhi() {
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
        text: undefined,
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
              y: 100,
              color: '#50B332',
            },
            {
              name: 'Chi phí vận chuyển',
              y: 60,
              color: '#DDDF00',
            },
            {
              name: 'Chi phí Marketing',
              y: 91,
              color: '#23CBE5',
            },
            {
              name: 'Chi phí vận hành',
              y: 24,
              color: '#64E571',
            },
            {
              name: 'Chi phí khác',
              y: 10,
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
}
