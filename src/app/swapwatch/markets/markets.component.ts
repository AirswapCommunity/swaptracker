import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs'
import { ERC20_tokens } from '../../shared/erc20';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

import { AirSwapDexService } from '../shared/air-swap-dex.service';
import { EtherscanService } from '../shared/etherscan.service';

import { HttpClient } from '@angular/common/http';
import { PlotlyHandler } from './plotlyHandler';
import * as d3 from 'd3';


@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.css']
})
export class MarketsComponent implements OnInit, OnDestroy {
  public first_block: number;
  public latest_block: number;

  public numTokens = 0;

  public tokenAddresses: Array<string> = [];

  public tokenProperties = {};
  public tokenPairStatistics = {};
  public combinedMarkets = {};

  public dropdownTokens: Array<any>;
  public dropdownMakerTokens: Array<any>;
  public dropdownTakerTokens: Array<any>;
  public selectedMakerToken: any;
  public selectedTakerToken: any;

  public tokenInfoLoaded: boolean = false;

  public timer: any;

  public refresh_time = 10000; // ms
  public numberOfBlock = 5838 * 14 // 14 days
  public isPlotOHLC: boolean = true;

  public plotlyHandler: PlotlyHandler;
  @ViewChild('chart') el: ElementRef;
  objectKeys = Object.keys;

  constructor(private http: HttpClient,
              private zone: NgZone,
              private airswapDEX: AirSwapDexService,
              private etherscan: EtherscanService) { }
  
  ngOnInit() {
    this.tokenProperties = this.airswapDEX.tokenProperties;
    this.plotlyHandler = new PlotlyHandler(this.el);
    this.initDexList();
    this.init_timer();
  }

  ngOnDestroy() {
    if(this.timer) this.timer.unsubscribe();
  }

  init_timer(): void {
    this.timer = TimerObservable.create(0, this.refresh_time)
    .subscribe( () => this.updateDexLists())
  }

  updateData() {
    // do something that the table updates
    this.plot();
  }

  plot() {
    if (this.isPlotOHLC) this.plotOHLC();
    else this.plotTimeChart();
  }

  plotTimeChart() {
    let txList = this.tokenPairStatistics[this.selectedMakerToken.address][this.selectedTakerToken.address];
    let txListOpposite = this.tokenPairStatistics[this.selectedTakerToken.address][this.selectedMakerToken.address];
    let buySymbol = this.tokenProperties[this.selectedMakerToken.address].symbol;
    let sellSymbol = this.tokenProperties[this.selectedTakerToken.address].symbol;
    this.plotlyHandler.TimeChartPlot(txList, txListOpposite,
                                     buySymbol, sellSymbol);

  }

  plotOHLC(): void { 
    let txList = this.tokenPairStatistics[this.selectedMakerToken.address][this.selectedTakerToken.address];
    let txListOpposite = this.tokenPairStatistics[this.selectedTakerToken.address][this.selectedMakerToken.address];
    let buySymbol = this.tokenProperties[this.selectedMakerToken.address].symbol;
    let sellSymbol = this.tokenProperties[this.selectedTakerToken.address].symbol;    
    this.plotlyHandler.OHLCPlot(txList, txListOpposite, buySymbol, sellSymbol);
  }

  get tokens(): any {
    return ERC20_tokens;
  }

  http_get(request: string): Observable<any> {
    return this.http.get(request);
  }

  initDexList(): void {
    this.etherscan.blockNumber()    // get blocknumber
    .then((blocknumber) => {
      blocknumber = parseInt(blocknumber.result, 16);
      this.first_block = blocknumber - this.numberOfBlock; // 24h for 14.8s block time
      this.latest_block = blocknumber;

      //get all filled events in time frame
      return this.etherscan.logsGetLogsAirSwapDEX(this.first_block, this.latest_block)
    }).then(DEXtxs => {
      this.tokenAddresses = [];
      this.tokenPairStatistics = {};
      this.dropdownTokens = [];

      // this.evalAirSwapDEX(DEXtxs.result); // go through results of API call and fill arrays
      this.airswapDEX.evalAirSwapDEXFilledEventLogs(DEXtxs.result,
              this.tokenAddresses, this.tokenPairStatistics, this.dropdownTokens);
      this.dropdownTokens = this.dropdownTokens.sort((obj1, obj2) => {
        if(obj1.label > obj2.label) return 1;
        if(obj1.label < obj2.label) return -1;
        return 0
      })
      for(let i in this.dropdownTokens) {
        let token = this.dropdownTokens[i];
        token.value.id = i;
      }
      this.combineMarkets();
      this.selectedMakerToken = this.dropdownTokens[0].value;
      this.dropdownUpdated();
      this.tokenInfoLoaded = true;
      // this.plot();
    }).catch(error => {
      console.log('Http Request failed. Retrying in ' + this.refresh_time/1e3);
    })
  }

  updateDexLists(): void {
    this.etherscan.blockNumber()
    .then((blocknumber) => {
      blocknumber = parseInt(blocknumber.result, 16);
      let new_first_block = this.latest_block + 1;
      this.latest_block = blocknumber;
      if (this.latest_block > new_first_block) {
        return this.etherscan.logsGetLogsAirSwapDEX(new_first_block, this.latest_block)
        .then(DEXtxs => {
          if(DEXtxs.status == 1) {
            console.log('Got new data.');
            // this.evalAirSwapDEX(DEXtxs.result);
            this.airswapDEX.evalAirSwapDEXFilledEventLogs(DEXtxs.result,
              this.tokenAddresses, this.tokenPairStatistics, this.dropdownTokens);
            this.combineMarkets();
            this.updateData();
          }
        }).catch(error => {
          console.log('Http Request failed. Retrying in ' + this.refresh_time/1e3);
        })
      }
    })
  }

  combineMarkets(): void {
    this.combinedMarkets = {}
    for(let makerToken in this.tokenPairStatistics) {
      this.combinedMarkets[makerToken] = {};
      for(let takerToken in this.tokenPairStatistics[makerToken]) {
        let stats = this.tokenPairStatistics[makerToken][takerToken];
        let opposite_market = this.tokenPairStatistics[takerToken][makerToken];
        if (opposite_market !== undefined && opposite_market.length > 0){
          let copy_opposite_market = opposite_market.map(x => Object.assign({}, x));
          for(let tx of copy_opposite_market) {
            tx.price = 1/tx.price;
          }
          stats = stats.concat(copy_opposite_market)
        }
        let sorted_stats = stats.sort((obj1, obj2) => {
          if(obj1.timestamp > obj2.timestamp) return 1;
          if(obj1.timestamp < obj2.timestamp) return -1;
          return 0;
        })
        this.combinedMarkets[makerToken][takerToken] = sorted_stats;
      }
    }
  }

  dropdownUpdated(): void {
    let previousTaker = this.selectedTakerToken;
    this.dropdownTakerTokens = this.dropdownTokens.map(x => Object.assign({}, x));
    this.dropdownTakerTokens.splice(this.selectedMakerToken.id, 1);

    if(previousTaker == undefined || previousTaker.id == this.selectedMakerToken.id) 
      this.selectedTakerToken = this.dropdownTakerTokens[0].value;
    else 
      this.selectedTakerToken = this.dropdownTokens[previousTaker.id].value;
    this.updateData();
  }

  get_tokenPairs(token): any {
    return this.tokenPairStatistics[token]
  }

  get_pairStatistic(token, tokenPair): Array<any> {
    return this.combinedMarkets[token][tokenPair];
  }

  get_tokenDecimal(token): number {
    return this.tokenProperties[token].decimal;
  }

  get_tokenSymbol(token): string {
    return this.tokenProperties[token].symbol;
  }

  get_addressSlice(address: string): string {
    return address.slice(0,8);
  }

}
