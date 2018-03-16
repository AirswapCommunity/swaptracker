import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../primeng/primeng.module';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

// Page Components
import { SwaptrackerComponent } from './swaptracker.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { MarketsComponent } from './markets/markets.component';

// Pipes
import { RelativeDatePipe } from '../shared/pipes/relative_time.pipe';
import { ReversePipe } from '../shared/pipes/reverse.pipe';
import { MyTradesComponent } from './my-trades/my-trades.component';

@NgModule({
  imports: [
    CommonModule,
    PrimeNgModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [ SwaptrackerComponent ],
  declarations: [
    SwaptrackerComponent, 
    PageHeaderComponent, 
    MarketsComponent,
    ReversePipe,
    RelativeDatePipe,
    MyTradesComponent],
  providers: [ DatePipe ]
})
export class SwaptrackerModule { }
