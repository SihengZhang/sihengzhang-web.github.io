import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StockInformationService } from './stock-information.service'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  providers: [StockInformationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hw3Frontend';
  activeButton = 1;

  constructor(private router: Router, private stockInformationService: StockInformationService) { }

  searchButton() {
    this.activeButton = 1;
    if(this.stockInformationService.ticker_symbol === '') {
      this.router.navigate(['/search/home']).then();
    } else {
      this.router.navigate([`/search/${this.stockInformationService.ticker_symbol}`]).then();
    }

  }
  watchlistButton() {
    this.activeButton = 2;
    this.router.navigate(['/watchlist']).then();
  }
  portfolioButton() {
    this.activeButton = 3;
    this.router.navigate(['/portfolio']).then();
  }
}
