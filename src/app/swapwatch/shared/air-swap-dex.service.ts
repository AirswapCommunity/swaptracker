import { Injectable } from '@angular/core';
import { ERC20_tokens } from '../../shared/erc20';

@Injectable()
export class AirSwapDexService {
  public AirSwapDEX: string = 
    '0x8fd3121013a07c57f0d69646e86e7a4880b467b7';
  public AirSwapTokenAddress: string = 
    '0x27054b13b1b798b345b591a4d22e6562d47ea75a';
  public AirSwapFilledEvent: string = 
    '0xe59c5e56d85b2124f5e7f82cb5fcc6d28a4a241a9bdd732704ac9d3b6bfc98ab';

  public tokenProperties: any = {};

  constructor() { 
    this.load_tokens();
  }

  load_tokens(): void {
    for(let token of ERC20_tokens) {
      this.tokenProperties[token.address] = {
         'name': token.name,
         'symbol': token.symbol,
         'decimal': 10**token.decimal,
         'logo': token.logo
      }
    }
  }

  evalAccTxListForAirSwapDEX(txList): Array<any> {
    let filteredTransactionList = [];
    let dexLower = this.AirSwapDEX.toLowerCase();
    for(let data of txList) {
      if(data.isError == '1') continue;
      if(data.to.toLowerCase() == dexLower) {
        let timestamp = data.timeStamp;
        let gasUsed = data.gasUsed;
        let gasPrice = data.gasPrice;
        let gasCost = gasPrice * gasUsed / 1e18;
        let input = data.input;

        let counterParty = this.removeLeadingZeros('0x'+input.slice(10+64*0,10+64*1));
        let buyAmount = parseInt('0x'+input.slice(10+64*1,10+64*2), 16);
        let boughtToken = this.removeLeadingZeros('0x'+input.slice(10+64*2,10+64*3));
        let myAddress = this.removeLeadingZeros('0x'+input.slice(10+64*3,10+64*4));
        let sellAmount = parseInt('0x'+input.slice(10+64*4,10+64*5), 16);
        let sellToken = this.removeLeadingZeros('0x'+input.slice(10+64*5,10+64*6));

        let buyProps = this.tokenProperties[boughtToken];
        let sellProps = this.tokenProperties[sellToken];
        let buySymbol = buyProps.symbol;
        let buyDecimal = buyProps.decimal;
        let sellSymbol = sellProps.symbol;
        let sellDecimal = sellProps.decimal;

        filteredTransactionList.push({
          'timestamp': timestamp,
          'counterparty': counterParty,
          'buyAmount': buyAmount / buyDecimal,
          'buySymbol': buySymbol,
          'sellAmount': sellAmount / sellDecimal,
          'sellSymbol': sellSymbol,
          'gasPrice': gasPrice,
          'gasUsed': gasUsed,
          'gasCost': gasCost,
          'price': sellAmount / sellDecimal / (buyAmount / buyDecimal)
        })
      }
    }
    return filteredTransactionList;
  }
  
  removeLeadingZeros(data): string {
    let cleaned_string = data.replace(/0x0*/,'0x');
    while(cleaned_string.length < 42) cleaned_string = cleaned_string.replace('0x', '0x0')
    return cleaned_string;
  }

  get_addressSlice(address: string): string {
    return address.slice(0,8);
  }  
}
