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
interface Point {
  y: number;
  x: number;
}
@Component({
  selector: 'statiscal-revenue-component',
  styleUrls: ['./statiscal-revenue.component.scss'],
  templateUrl: './statiscal-revenue.component.html',
})
export class StatiscalRevenueComponent implements OnInit{
  info:any;
  today = new Date();
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();
  typeShow = 1;
  shop :any;
  shopList : any;
  SHOP_URL = "/api/v1/shop";
  refundRate = 0;
  shopCodeList = [];
  listChart: any[] = [];
  REQUEST_URL = "/api/v1/statistics-revenue/search";
  data = '';
  value = '';
  listData: any;
  chartOptions: any;
  plugins = new Plugin();
  tongDoanhThu=0;
  tongChiPhi=0;
  tongLoiNhuan=0;
  startDate: any;
  endDate: any;
  isToastOpen = false;
  messageToast = '';
  dateRange = {
    startDate: moment().utc().format('YYYY-MM-DD'),
    endDate: moment().utc().format('YYYY-MM-DD'),
  };
  ngOnInit(): void {
    if(this.info.role === 'admin'){
      this.shop = this.localStorage.retrieve("shop") ? this.localStorage.retrieve("shop"):'';
      this.statistic();
  }
  }
  constructor(
    private dmService: DanhMucService,
    private localStorage: LocalStorageService,
    private loading: LoadingController
  ) {
    this.info = this.localStorage.retrieve('authenticationtoken');
  }
  statistic() {
    if (this.typeShow == 1) {
        let date = moment().format("YYYY") + "/" + this.month;
        this.startDate = moment(date).startOf('month').format("YYYYMMDD");
        this.endDate = moment(date).endOf('month').format("YYYYMMDD");
    } else if (this.typeShow == 2) {
        this.startDate = moment(this.year.toString()).startOf('year').format("YYYYMMDD");
        this.endDate = moment(this.year.toString()).endOf('year').format("YYYYMMDD");
    } else {
        this.startDate = moment("2021").startOf('year').format("YYYYMMDD");
        this.endDate = moment(this.year.toString()).endOf('year').format("YYYYMMDD");
    }
    this.loadData()
    
}

public async loadData(){
  await this.isLoading();
  this.dmService.get(this.REQUEST_URL + "?startDate=" + this.startDate + "&endDate=" + this.endDate + "&shop=" + this.shop.id+ "&type=" + this.typeShow).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.loading.dismiss();
            this.listChart = res.body.RESULT;
                        this.customsData(this.listChart);
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
customsData(list: any) {
  this.tongChiPhi=0;
  this.tongDoanhThu=0;
  this.tongLoiNhuan=0;
  const listTongDT=[];
  const listChiPhi=[];
  const listLoiNhuan=[];
  const listSubTitle = [];
  let tGiaVon=0;
  let tVanHanh=0;
  let tvanChuyen=0;
  let tMKT=0;
  let tKhac=0;
  if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
          const cp = (list[i].operatingCost ? list[i].operatingCost : 0)+(list[i].costPrice ? list[i].costPrice : 0)+(list[i].shippingCost ? list[i].shippingCost : 0)+(list[i].otherCost ? list[i].otherCost : 0)+(list[i].mktCost ? list[i].mktCost : 0);
          // biểu đồ 1
          listTongDT.push(list[i].revenue ? list[i].revenue : 0);
          listChiPhi.push(cp);
          listLoiNhuan.push(list[i].profit ? list[i].profit : 0);
          // biểu đồ 2
          tGiaVon+=(list[i].costPrice ? list[i].costPrice : 0);
          tVanHanh+=(list[i].operatingCost ? list[i].operatingCost : 0);
          tvanChuyen+=(list[i].shippingCost ? list[i].shippingCost : 0);
          tMKT+=(list[i].mktCost ? list[i].mktCost : 0);
          tKhac+=(list[i].otherCost ? list[i].otherCost : 0);
          // tổng
          this.tongChiPhi +=  cp;
          this.tongDoanhThu +=  list[i].revenue ? list[i].revenue : 0;
          this.tongLoiNhuan +=  list[i].profit ? list[i].profit : 0;
          listSubTitle.push(list[i].date ? (this.typeShow!=1?list[i].date:moment(list[i].date, "YYYYMMDD").format("DD/MM")) : 'null');
          list[i].dateCustoms = list[i].date ? (this.typeShow!==1?list[i].date:moment(list[i].date, "YYYYMMDD").format("DD/MM/YYYY")) : ''
              
        }
  }
  this.chartDongTien(listTongDT,listChiPhi,listLoiNhuan,listSubTitle);
  this.chartTongChiPhi(tGiaVon,tVanHanh,tvanChuyen,tMKT,tKhac);
  this.chartLoiNhuan();
  
}


chartDongTien(listTongDT:any,listChiPhi:any,listLoiNhuan:any,listSubTitle:any) {
  const _this = this;
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
      text: 'Thống kê dòng tiền',
                align: 'center',
                style: {
                    color: '#006EB9',
                    fontWeight: 'bold'
                }
    },
    xAxis: {
      categories: listSubTitle,
      crosshair: true,
      scrollbar: {
          enabled: true
      }
  },
  yAxis: {
    labels: {
      // formatter: () => {
      //   return this.formatNumber(this.value) + 'đ';
      // },
    },
    title: {
      text: 'Số tiền',
      style: {
        fontWeight: 'bold'
      }
    }
  },
  
  
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter: function (this:any):any {
        return  _this.plugins.formatNumber(this.y)+'đ'
      }
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
        name: 'Tổng doanh thu',
        data: listTongDT,
        tooltip: {
            valueSuffix: 'đ'
        },
        color: '#006EB9'
    }, {
        name: 'Chi phí',
        data: listChiPhi,
        tooltip: {
            valueSuffix: 'đ'
        },
        color: '#7EB900'
    }, {
        name: 'Lợi nhuận',
        data: listLoiNhuan,
        tooltip: {
            valueSuffix: 'đ'
        },
        color: '#C85757'
      },
    ],
  };
  Highcharts.chart('chartDongTien', chartOption);
}
chartTongChiPhi(tGiaVon:any,tVanHanh:any,tvanChuyen:any,tMKT:any,tKhac:any) {
  const _this = this;
  if(this.tongChiPhi === 0){
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
      text: undefined,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.2f}%</b>'
    },
    accessibility: {
      point: {
          valueSuffix: '%'
      }
  },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          formatter:function (this: any):any {
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
    series: [{
      data: [{
          name: 'Chi phí giá vốn: ' + this.plugins.formatNumber(tGiaVon) +'đ',
          y: tGiaVon,
          color:'#FF4747'
      },  {
          name: 'Chi phí vận hành: ' + this.plugins.formatNumber(tVanHanh) +'đ',
          y: tVanHanh,
          color:'#47AC4F'
      },  {
          name: 'Chi phi khác: ' + this.plugins.formatNumber(tKhac) +'đ',
          y: tKhac,
          color:'#D072F1'
      }, {
          name: 'Chi phí vận chuyển: ' + this.plugins.formatNumber(tvanChuyen) +'đ',
          y: tvanChuyen,
          color:'#C8930C'
      }, {
          name: 'Chi phí marketing: ' + this.plugins.formatNumber(tMKT) +'đ',
          y: tMKT,
          color:'#C8B216'
      }],
      showInLegend: true,
  }]
  };
  Highcharts.chart('chartTongChiPhi', chartOption);
}
chartLoiNhuan() {
  if(this.tongDoanhThu === 0){
    return;
}
const chiPhi = this.rounded(this.tongChiPhi/this.tongDoanhThu*100);
const loiNhuan = 100 - chiPhi;
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
    series: [{
      name: 'Tổng doanh thu',
      colorByPoint: true,
      type: undefined,
      data: [
        {
            name: '',
            y: 100,
            color: '#fff'
        }
    ],
    size: '60%',
    dataLabels: {
        enabled: false
    }
    },{
    name: '',
    data: [
        {
            name: 'Tổng chi phí',
            y: chiPhi,
            color: '#7EB900'
        },
        {
            name: 'Lợi nhuận',
            y: loiNhuan,
            color: '#C85757'
        }
    ],
    size: '80%',
    innerSize: '60%',
    dataLabels: {
      enabled: true,
  },
    id: 'versions'
  }]
  };
  Highcharts.chart('chartLoiNhuan', chartOption);
}

rounded(e:number){
  return e?(Math.round((e + Number.EPSILON) * 100) / 100):0;
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
public formatNumber(number: any) {
  return Number(number) ? Number(number).toLocaleString("vi-VN") : 0;
}
refreshData() {
  this.dateRange = {
    startDate: moment().utc().subtract(6, 'days').format('YYYY-MM-DD'),
    endDate: moment().utc().format('YYYY-MM-DD'),
  };
  this.statistic();
}
handleRefresh(event: any) {
  this.statistic();
  event.target.complete();
}

}