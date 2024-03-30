import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {StockInformationService, Portfolio, Watchlist} from '../stock-information.service';
import {Router} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgForOf, NgIf} from "@angular/common";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {SellmodalComponent} from "../sellmodal/sellmodal.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [HttpClientModule, MatProgressSpinner, NgForOf, NgIf, NgbAlert, NgbModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit{
  public portfolio: any;

  constructor(private router: Router, private http: HttpClient, private modalService: NgbModal) { }
  ngOnInit() {
    this.http.get<Watchlist[]>('http://sihengzhang-HW3.us-east-2.elasticbeanstalk.com/Portfolio').subscribe((result) => {
      this.portfolio = result;
    }, error => {
      console.error('There was an error!', error);
    });
  }

  operation_buy(ticker: string, price: number) {
    const modalRef = this.modalService.open(SellmodalComponent);
    modalRef.componentInstance.ticker = ticker;
    modalRef.componentInstance.balance = this.portfolio.balance;
    modalRef.componentInstance.price = price;
    modalRef.componentInstance.isBuy = true;

  }

  operation_sell(ticker: string, price: number) {
    const modalRef = this.modalService.open(SellmodalComponent);
    modalRef.componentInstance.ticker = ticker;
    modalRef.componentInstance.balance = this.portfolio.balance;
    modalRef.componentInstance.price = price;
    modalRef.componentInstance.isBuy = false;
  }

}
