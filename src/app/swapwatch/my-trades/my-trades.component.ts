import { Component, OnInit } from '@angular/core';

import { AirSwapDexService } from '../shared/air-swap-dex.service';
import { EtherscanService } from '../shared/etherscan.service';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-trades',
  templateUrl: './my-trades.component.html',
  styleUrls: ['./my-trades.component.css']
})
export class MyTradesComponent implements OnInit {

  public accAddress: string;

  public fromBlock: number = 0;
  public toBlock: number = 9999999999;

  public myTransactionList: Array<any> = [];
  public loadedList: boolean = false;

  public etherscan: Etherscan;

  public responseMessage = '';

  constructor(private http: HttpClient,
              private airswapDEX: AirSwapDexService,
              private etherscan: EtherscanService) { }

  ngOnInit() {
    this.init_window();
  }


  init_window(): void {

  }

  loadTrades(): void {
    this.myTransactionList = [];
    this.loadedList = false;
    if(this.checkAccAddress()) {
      this.responseMessage = 'Loading trades from etherscan. Please standby...';

      this.etherscan.accountTxList(this.accAddress, this.fromBlock, this.toBlock)
      .then((httpResponse) => {
        if(httpResponse.status == 1) {
          let txList = httpResponse.result;
          this.myTransactionList = this.airswapDEX.evalAccTxListForAirSwapDEX(txList);
          this.loadedList = true;
          this.responseMessage = '';
        } else {
          this.responseMessage = 'API request failed.'
        }
      })
    } else {
      this.responseMessage = 'Invalid Address';
    }
  }

  checkAccAddress(): boolean {
    return /^(0x)[0-9a-f]{40}$/i.test(this.accAddress);
  }

  get_addressSlice(address: string): string {
    return address.slice(0,8);
  } 
}
