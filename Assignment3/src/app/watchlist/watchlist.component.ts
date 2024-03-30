import {Component, OnInit} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {StockInformationService, Watchlist} from '../stock-information.service';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgForOf, NgIf} from "@angular/common";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [HttpClientModule, MatProgressSpinner, NgIf, NgbAlert, ReactiveFormsModule, NgForOf],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {

  public watchlist: any;

  constructor(private router: Router, private http: HttpClient, private stockInformationService: StockInformationService) { }
  ngOnInit() {
    this.http.get<Watchlist[]>('http://sihengzhang-HW3.us-east-2.elasticbeanstalk.com/WatchList').subscribe((result) => {
      this.watchlist = result;
      console.log(this.watchlist);
    }, error => {
      console.error('There was an error!', error);
    });
  }

  open(ticker: string) {
    this.router.navigate([`/search/${ticker}`]).then();
  }
  close(ticker: string) {
    this.http.get(`http://sihengzhang-HW3.us-east-2.elasticbeanstalk.com/WatchList/Delete/${ticker}`).subscribe((result) => {
      console.log(result);
      if(ticker === this.stockInformationService.ticker_symbol) {
        this.stockInformationService.star_status = false;
      }
      this.http.get<Watchlist[]>('http://sihengzhang-HW3.us-east-2.elasticbeanstalk.com/WatchList').subscribe((result) => {
        this.watchlist = result;
        console.log(this.watchlist);
      }, error => {
        console.error('There was an error!', error);
      });

    }, error => {
      console.error('There was an error!', error);
    });
  }

  protected readonly parseFloat = parseFloat;
}
