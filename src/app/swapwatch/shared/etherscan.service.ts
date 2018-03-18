import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AirSwapDexService } from './air-swap-dex.service';

@Injectable()
export class EtherscanService {

  constructor(private airswapDEX: AirSwapDexService,
              private http: HttpClient) { }

  http_get(request: string): Observable<any> {
    return this.http.get(request);
  }

  blockNumber(): Promise<any> {
    return this.http_get('https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey='+
      this.etherscan_token
    ).toPromise()
  }

  accountTxList(accAddress, fromBlock, toBlock): Promise<any> {
    return this.http_get(
            'https://api.etherscan.io/api?module=account&action=txlist'+
            '&address='+accAddress+
            '&startblock='+fromBlock+
            '&endblock='+toBlock+
            '&sort=desc'+
            '&apikey='+this.etherscan_token).toPromise()
  }

  logsGetLogsAirSwapDEX(firstBlock, toBlock): Promise<any> {
    return this.http_get(
            'https://api.etherscan.io/api?module=logs&action=getLogs'+
            '&address='+this.airswapDEX.AirSwapDEX+
            '&fromBlock='+firstBlock+
            '&toBlock='+toBlock+
            '&topic0='+this.airswapDEX.AirSwapFilledEvent+
            '&apikey='+this.etherscan_token
            ).toPromise()
  }
}
