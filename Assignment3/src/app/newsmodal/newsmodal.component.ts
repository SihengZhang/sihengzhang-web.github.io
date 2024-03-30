import { Component, Input } from '@angular/core';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {TopNews} from '../stock-information.service'
@Component({
  selector: 'app-newsmodal',
  standalone: true,
  imports: [NgbModule, NgbModalModule],
  templateUrl: './newsmodal.component.html',
  styleUrl: './newsmodal.component.css'
})
export class NewsmodalComponent {

  constructor(public activeModal: NgbActiveModal) {}
  @Input() news_content: any;

  protected readonly encodeURIComponent = encodeURIComponent;
}
