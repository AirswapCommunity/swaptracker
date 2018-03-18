import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../primeng/primeng.module';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

// Page Components
import { SwapwatchComponent } from './swapwatch.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { MarketsComponent } from './markets/markets.component';

// Shared Services
import { EtherscanService } from './shared/etherscan.service';
import { AirSwapDexService } from './shared/air-swap-dex.service';

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
  exports: [ SwapwatchComponent ],
  declarations: [
    SwapwatchComponent, 
    PageHeaderComponent, 
    MarketsComponent,
    ReversePipe,
    RelativeDatePipe,
    MyTradesComponent],
  providers: [ 
    DatePipe,
    EtherscanService,
    AirSwapDexService ]
})
export class SwapwatchModule { }
