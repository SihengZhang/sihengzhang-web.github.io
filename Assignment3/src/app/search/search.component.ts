import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {Router, RouterOutlet} from '@angular/router';
import { StockInformationService } from '../stock-information.service'
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, NgbModule, CommonModule, HttpClientModule, RouterOutlet],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  constructor(private http: HttpClient, private router: Router, private stockInformationService: StockInformationService) {}

  public userInput: string = this.stockInformationService.ticker_symbol;
  showAlert: boolean = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event);
    if (event.key === 'Enter') {
      this.searchButton();
    }
  }

  searchButton() {
    if(this.userInput === '') {
      this.showAlert = true;
      return;
    }

    const url = `http://sihengzhang-HW3.us-east-2.elasticbeanstalk.com/Summary1/${this.userInput}`;
    this.http.get(url).subscribe(
      (response) => {
        if(Object.keys(response).length === 0) {
          this.showAlert = true;
          return;
        }
        this.router.navigate([`/search/${this.userInput}`]).then();

      },
      (error) => {
        console.error('Error fetching data:', error); // Handle errors here
      }
    );

  }

  clearButton() {
    this.stockInformationService.ticker_symbol = '';
    this.userInput = '';
    this.showAlert = false;
    this.router.navigate(['/search/home']).then();
  }

}
