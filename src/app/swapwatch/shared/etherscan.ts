import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AirSwapDEX } from './airSwapDEX';

export class Etherscan {

  public etherscan_token: string = '8FWC8GZWSE8SJKY7NBSE77XER4KQ8NXK1Z';
  constructor(private http: HttpClient) { }

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

  logsGetLogs(address, firstBlock, toBlock, topics): Promise<any> {
    let topicString = "";
    for(let i in topics) {
      console.log(i);
      topicString = '&topic' + i +'=' + topics[i]
    }
    return this.http_get(
            'https://api.etherscan.io/api?module=logs&action=getLogs'+
            '&address='+address+
            '&fromBlock='+firstBlock+
            '&toBlock='+toBlock+
            topicString+
            '&apikey='+this.etherscan_token
            ).toPromise()
  }
}