import { Component, Input } from '@angular/core';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {Watchlist} from "../stock-information.service";
import {HttpClient} from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-sellmodal',
  standalone: true,
  imports: [NgbModule, NgbModalModule, CommonModule, FormsModule],
  templateUrl: './sellmodal.component.html',
  styleUrl: './sellmodal.component.css'
})
export class SellmodalComponent {

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) {}
  @Input() ticker: any;
  @Input() balance: any;
  @Input() price: any;
  @Input() isBuy: any;

  public number: number = 0;

  operate() {
    if(this.isBuy) {
      this.http.get<Watchlist[]>(`http://sihengzhang-HW3.us-east-2.elasticbeanstalk.com/Portfolio/Buy/${this.ticker}/${this.number}/${this.price}`).subscribe((result) => {
        this.activeModal.dismiss('Cross click');
      }, error => {
        console.error('There was an error!', error);
      });
    } else {
      this.http.get<Watchlist[]>(`http://sihengzhang-HW3.us-east-2.elasticbeanstalk.com/Portfolio/Sell/${this.ticker}/${this.number}/${this.price}`).subscribe((result) => {
        this.activeModal.dismiss('Cross click');
      }, error => {
        console.error('There was an error!', error);
      });

    }
  }

}
