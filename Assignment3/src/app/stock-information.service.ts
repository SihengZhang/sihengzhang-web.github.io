import {inject, Injectable} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
export interface StockDetails {
  Ticker: string;
  CompanyName: string;
  ExchangeCode: string;
  Logo: string;
  LastPrice: string;
  Change: string;
  ChangePercentage: string;
  CurrentTimestamp: string;
  MarketStatus: string;
}

export interface Summary1 {
  HighPrice: number;
  LowPrice: number;
  OpenPrice: number;
  PrevClose: number;
  Timestamp: number;
}

export interface Summary2 {
  IPOStartDate: string;
  Industry: string;
  Webpage: string;
  CompanyPeers: string[];
}

export interface TopNews {
  Source: string;
  Title: string;
  Description: string;
  URL: string;
  Image: string;
  PublishedDate: string;
}

export interface Insights {
  TotalMSPR: number;
  PositiveMSPR: number;
  NegativeMSPR: number;
  TotalChange: number;
  PositiveChange: number;
  NegativeChange: number;
}

export interface RecommendationTrends {
  StrongBuy: number[];
  Buy: number[];
  Hold: number[];
  Sell: number[];
  StrongSell: number[];
  Period: string[];
  Name: string[];
}

export interface CompanyEarnings {
  Actual: number[];
  Estimate: number[];
  Surprise: number[];
  Period: string[];
  XAxis: number[];
}

export interface Watchlist {
  Ticker: string;
  CompanyName: string;
  LastPrice: number;
  Change: number;
  ChangePercentage: string;
}

export interface info {
  ticker: string;
  quantity: number;
  cost_per_share: number;
  cost: number;
  company_name: string;
  current_price: number;
  change: number;
  market_value: number;

}

export interface Portfolio {
  balance: number;
  stocks_info: info[];
}

@Injectable({
  providedIn: 'root',
})
export class StockInformationService {

  public ticker_symbol: string = ``;
  public star_status: boolean = false;
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


  private url = 'http://sihengzhang-HW3.us-east-2.elasticbeanstalk.com';

  constructor(private http: HttpClient) {}

  fetchData(ticker: string): Observable<any[]> {
    if(this.ticker_symbol === ticker) {
      return of([
        this.ticker_symbol, this.stock_details, this.prices,
        this.summary1, this.summary2,
        this.top_news, this.charts,
        this.insights, this.recommendation_trends,
        this.company_earnings, this.watchlist]);
    } else {
      return forkJoin([
        this.http.get<StockDetails>(this.url + `/StockDetails/${ticker}`),
        this.http.get(this.url + `/StockPrices/${ticker}`),
        this.http.get<Summary1>(this.url + `/Summary1/${ticker}`),
        this.http.get<Summary2>(this.url + `/Summary2/${ticker}`),
        this.http.get<TopNews[]>(this.url + `/TopNews/${ticker}`),
        this.http.get(this.url + `/Charts/${ticker}`),
        this.http.get<Insights>(this.url + `/Insights/${ticker}`),
        this.http.get<RecommendationTrends>(this.url + `/RecommendationTrends/${ticker}`),
        this.http.get<CompanyEarnings>(this.url + `/CompanyEarnings/${ticker}`),
        this.http.get<Watchlist[]>(this.url + `/WatchList`),

      ]).pipe(
        tap(results => {
          this.ticker_symbol = results[0][`Ticker`];
          this.stock_details = results[0];
          this.prices = results[1];
          this.summary1 = results[2];
          this.summary2 = results[3];
          this.top_news = results[4];
          this.charts = results[5];
          this.insights = results[6];
          this.recommendation_trends = results[7];
          this.company_earnings = results[8];
          this.watchlist = results[9];

          for(let item of this.watchlist) {
            if(item.Ticker === this.stock_details.Ticker) {
              this.star_status = true;
            }
          }

        })
      );
    }

  }




}
