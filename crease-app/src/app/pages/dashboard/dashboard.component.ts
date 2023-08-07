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
  }
  getDataChiPhiTruocHoan() {
    const chartOption: any = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
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
              name: 'Giá vốn trước hoàn',
              y: 100,
              color: '#51b333',
            },
            {
              name: 'Chi phí vận chuyển trước hoàn',
              y: 60,
              color: '#66E471',
            },
            {
              name: 'Chi phí vận chuyển trước hoàn',
              y: 91,
              color: '#66E471',
            },
            {
              name: 'Chi phí marketing',
              y: 24,
              color: '#dbe000',
            },
            // {
            //   name: "Chi phí khác",
            //   y: 1000000000,
            //   color: "#ff9557",
            // },
          ],
        },
      ],
    };
    Highcharts.chart('chartTongChiPhiTruocHoan', chartOption);
  }
}
