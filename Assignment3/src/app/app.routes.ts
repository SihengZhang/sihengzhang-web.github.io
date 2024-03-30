import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {WatchlistComponent} from "./watchlist/watchlist.component";
import {PortfolioComponent} from "./portfolio/portfolio.component";
import {DetailsComponent} from "./details/details.component";
import { SearchComponent } from "./search/search.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/search/home',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchComponent,
    children: [{path: 'home', component: HomeComponent, title: 'Home page'},
               {path: ':ticker', component: DetailsComponent, title: 'Details page'}]
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
    title: 'watchlist page'
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    title: 'portfolio page'
  }
];
