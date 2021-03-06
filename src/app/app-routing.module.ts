import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {MarketsComponent} from './swapwatch/markets/markets.component';
import {MyTradesComponent} from './swapwatch/my-trades/my-trades.component';

const routes: Routes = [
  { path: '', redirectTo: '/Markets', pathMatch: 'full'},
  { path: 'Markets', component:MarketsComponent},
  { path: 'MyTrades', component:MyTradesComponent},
];

@NgModule({  
  imports: [ RouterModule.forRoot(routes)], //, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}