import { Component, OnInit} from '@angular/core';
import {StockInformationService, TopNews, Watchlist} from '../stock-information.service'
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
import 'highcharts/indicators/indicators';
import 'highcharts/indicators/volume-by-price';
import {NewsmodalComponent} from '../newsmodal/newsmodal.component'
import {SellmodalComponent} from "../sellmodal/sellmodal.component";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [HttpClientModule, MatProgressSpinnerModule, NgIf, NgbAlert,
    ReactiveFormsModule, NgOptimizedImage, CommonModule, MatTabsModule, HighchartsChartModule, NgbModule, NewsmodalComponent,
    SellmodalComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{

  constructor(private stockInformationService: StockInformationService, private route: ActivatedRoute, private modalService: NgbModal, private http: HttpClient) { }

  ticker: string = ``;
  star_status: boolean = this.stockInformationService.star_status;

  public stock_details: any;
  public prices: any;
  public summary1: any;
  public summary2: any;
  public top_news: any;
  public charts: any;
  public insights: any;
  public recommendation_trends: any;
  public company_earnings: any;
  public watchlist: any;
  public portfolio: any;

  news1: TopNews[] = [];
  news2: TopNews[] = [];

  starAlert = false;



  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsSMA: Highcharts.Options = {};
  chartOptionsStack: Highcharts.Options = {};
  chartOptionsSpline: Highcharts.Options = {};
  chartOptionsPrice: Highcharts.Options = {};

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if(params.get('ticker') !== null) {

        this.ticker = params.get('ticker')!;
        this.getDataFromServer(this.ticker);

      } else {
        this.ticker = `BILI`;
        console.log(`Empty ticker!`)
      }
    });
  }

  getDataFromServer(symbol: string){
        this.stockInformationService.fetchData(symbol).subscribe({
          next: () => {

            this.stock_details = this.stockInformationService.stock_details;
            this.prices = this.stockInformationService.prices;
            this.summary1 = this.stockInformationService.summary1;
            this.summary2 = this.stockInformationService.summary2;
            this.top_news = this.stockInformationService.top_news;
            this.charts = this.stockInformationService.charts;
            this.insights = this.stockInformationService.insights;
            this.recommendation_trends = this.stockInformationService.recommendation_trends;
            this.company_earnings = this.stockInformationService.company_earnings;
            this.watchlist = this.stockInformationService.watchlist;

            for(let i = 0; i < this.top_news.length; i = i + 2) {
              if(i < this.top_news.length) {
                this.news1.push(this.top_news[i]);
              }
              if(i + 1 < this.top_news.length) {
                this.news2.push(this.top_news[i + 1]);
              }
            }

            this.setSMACharts();
            this.setStackCharts();
            this.setSplineCharts();
            this.setPriceCharts();
          },
          error: (error) => console.error('Error fetching data:', error),
        });
  }

  starButton() {
    if(this.stockInformationService.star_status) {
      this.http.get(`http://sihengzhang-HW3.us-east-2.elasticbeanstalk.com/WatchList/Delete/${this.stock_details.Ticker}`).subscribe((result) => {
        this.stockInformationService.star_status = false;
        this.star_status = false;
      }, error => {
        console.error('There was an error!', error);
      });
    } else {
      this.http.get(`http://sihengzhang-HW3.us-east-2.elasticbeanstalk.com/WatchList/Add/${this.stock_details.Ticker}`).subscribe((result) => {
        this.stockInformationService.star_status = true;
        this.star_status = true;
        this.starAlert = true;
      }, error => {
        console.error('There was an error!', error);
      });
    }
  }

  open(news_content: TopNews) {
    const modalRef = this.modalService.open(NewsmodalComponent);
    modalRef.componentInstance.news_content = news_content;
  }

  operation_buy() {
    const modalRef = this.modalService.open(SellmodalComponent);
    modalRef.componentInstance.ticker = this.stock_details.Ticker;
    modalRef.componentInstance.balance = 25000;
    modalRef.componentInstance.price = this.stock_details.LastPrice;
    modalRef.componentInstance.isBuy = true;

  }

  operation_sell() {
    const modalRef = this.modalService.open(SellmodalComponent);
    modalRef.componentInstance.ticker = this.stock_details.Ticker;
    modalRef.componentInstance.balance = 25000;
    modalRef.componentInstance.price = this.stock_details.LastPrice;
    modalRef.componentInstance.isBuy = false;
  }

  setSMACharts() {
    const ohlc = [],
      volume = [],
      dataLength = this.charts.length,
      groupingUnits = [['week', [1]], ['month', [1, 2, 3, 4, 6]]];

    for (let i = 0; i < dataLength; i += 1) {
      ohlc.push([
        this.charts[i][0], // the date
        this.charts[i][1], // open
        this.charts[i][2], // high
        this.charts[i][3], // low
        this.charts[i][4] // close
      ]);

      volume.push([
        this.charts[i][0], // the date
        this.charts[i][5] // the volume
      ]);
    }
    this.chartOptionsSMA = {
      rangeSelector: {
        selected: 2
      },

      title: {
        text: `${this.ticker} Historical`
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },
      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },

      plotOptions: {
        series: {
          dataGrouping: {
            units: [['week', [1]], ['month', [1, 2, 3, 4, 6]]]
          }
        }
      },

      series: [{
        type: 'candlestick',
        name: `${this.ticker}`,
        id: 'aapl',
        zIndex: 2,
        data: ohlc
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
      }]
    };
  }

  setStackCharts() {
    this.chartOptionsStack = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Recommendation Trends',
      },
      xAxis: {
        categories: this.recommendation_trends.Period
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis'
        },
        stackLabels: {
          enabled: true
        }
      },
      legend: {
        align: 'left',
        x: 70,
        verticalAlign: 'bottom',
        y: 10,
        floating: false,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        type: 'column',
        name: 'Strong Buy',
        color: '#02ff7f',
        data: this.recommendation_trends.StrongBuy
      }, {
        type: 'column',
        name: 'Buy',
        color: '#3cca6c',
        data: this.recommendation_trends.Buy
      }, {
        type: 'column',
        name: 'Hold',
        color: '#77945c',
        data: this.recommendation_trends.Hold
      }, {
        type: 'column',
        name: 'Sell',
        color: '#b25f4a',
        data: this.recommendation_trends.Sell
      }, {
        type: 'column',
        name: 'Strong Sell',
        color: '#ed2937',
        data: this.recommendation_trends.StrongSell
      }]
    };
  }

  setSplineCharts() {
    this.chartOptionsSpline = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Historical EPS Surprises',
      },
      xAxis: {
        categories: this.company_earnings.XAxis
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS'
        },
        labels: {
          format: '{value}'
        },
        accessibility: {
          rangeDescription: 'Range: -90°C to 20°C.'
        },
        lineWidth: 2
      },
      legend: {
        align: 'left',
        x: 70,
        verticalAlign: 'bottom',
        y: 10,
        floating: false,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x} km: {point.y}°C'
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: true
          }
        }
      },
      series: [{
        type: 'spline',
        name: 'Actual',
        data: this.company_earnings.Actual
      }, {
        type: 'spline',
        name: 'Estimate',
        data: this.company_earnings.Estimate
      }]

    };
  }

  setPriceCharts() {
    let color;
    if(this.stock_details.MarketStatus == "Close") {
      color = 'red';
    } else {
      color = 'green'
    }
    this.chartOptionsPrice = {
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%e. %b',
          week: '%e. %b',
          month: '%b \'%y',
          year: '%Y'
        }
      },
      rangeSelector: {
        selected: 1
      },
      title: {
        text: `${this.ticker} Stock Price`
      },
      series: [{
        name: `${this.ticker}`,
        type: 'line',
        color: color,
        data: this.prices,
        tooltip: {
          valueDecimals: 2
        }
      }]
    };
  }

  protected readonly parseFloat = parseFloat;
}
