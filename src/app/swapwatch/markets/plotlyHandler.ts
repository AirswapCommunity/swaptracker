import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

export class PlotlyHandler {

  public increasingColor: string = '#008837';
  public decreasingColor: string = '#ca0020';
  public el: ElementRef;

  constructor(private _el: ElementRef) {
    this.el = _el;
  }

  TimeChartPlot(txList: Array<any>, txListOpposite: Array<any>,
                buySymbol: string, sellSymbol:string) {

    let x_data = [];
    let y_data = [];

    let x_volume = [];
    let y_volume = [];
    let y_volprice = [];
    for (let tx of txList) {
      let price = tx.price;
      let time = new Date(tx.timestamp*1000);
      x_data.push(time);
      y_data.push(price);

      y_volprice.push(price);
      x_volume.push(time);
      y_volume.push(tx.buyAmount);

    }

    let x_opp_data = [];
    let y_opp_data = [];
    for (let tx of txListOpposite) {
      let price = 1/tx.price;
      let time = new Date(tx.timestamp*1000);
      x_opp_data.push(time);
      y_opp_data.push(price);

      x_volume.push(time);
      y_volume.push(tx.sellAmount);
      y_volprice.push(price);
    }
    
    let volumeColors = [];
    for(let i in y_volprice) {
      if(+i > 0) {
          if(y_volprice[+i] > y_volprice[+i-1]){
            volumeColors.push(this.increasingColor);
          } else {
            volumeColors.push(this.decreasingColor)
          }
      } else {
        volumeColors.push(this.decreasingColor)
      }
    }

    let traceBuy = {
      x: x_data,
      y: y_data,
      xaxis:'x',
      yaxis:'y2',
      name: 'Taker buys ' + buySymbol,
      line: {color: this.increasingColor}
    }
    let traceSell = {
      x: x_opp_data,
      y: y_opp_data,
      xaxis:'x',
      yaxis:'y2',
      name: 'Taker buys ' + sellSymbol,
      line: {color: this.decreasingColor}
    }
    let volumeTrace = {
      x: x_volume,
      y: y_volume,                         
      marker: {color: volumeColors},
      type: 'bar',
      xaxis:'x',
      yaxis:'y',
      name:'Volume'
    }


    let data = [traceBuy, traceSell, volumeTrace]
    let element = this.el.nativeElement;
    let style = {
      showlegend: false, 
      title: buySymbol + '/' + sellSymbol,
      xaxis: {
        autorange: true,
        rangeselector: {buttons: [
          {
            count: 1,
            label: '1h',
            step: 'hour',
            stepmode: 'backward'
          },
          {
            count: 24,
            label: '24h',
            step: 'hour',
            stepmode: 'backward'
          },
          {
            count: 7,
            label: '7d',
            step: 'day',
            stepmode: 'backward'
          },
          {
            count: 14,
            label: '14d',
            step: 'day',
            stepmode: 'backward'
          },
            {step: 'all'}
        ]},
        rangeslider: {
           visible: false
        },
        type: 'date',
        title: 'Time'
      }, 
      yaxis: {
        autorange: true,
        domain: [0., 0.2]
      },
      yaxis2: {
        type: 'linear',
        autorange: true, 
        title: buySymbol + '/' + sellSymbol,
        domain: [0.25, 1]
      }
    }
    Plotly.newPlot( element, data, style )
    window.onresize = () => {
      Plotly.Plots.resize(element);
    }
  }

  OHLCPlot(txList: Array<any>, txListOpposite: Array<any>,
           buySymbol: string, sellSymbol: string): void {
    
    let tx_data = [];
    for (let tx of txList) {
      tx_data.push({'timestamp': tx.timestamp,
                 'price': tx.price,
                 'volume': tx.buyAmount});
    }
    for (let tx of txListOpposite) {
      tx_data.push({'timestamp': tx.timestamp,
                 'price': 1/tx.price,
                 'volume': tx.sellAmount});
    }

    let ohlc_data = this.convertToOHLC(tx_data);
    let date = [];
    let close = [];
    let open = [];
    let high = [];
    let low = [];
    let volume = [];
    for(let data of ohlc_data) {
      date.push(data.timestamp);
      close.push(data.close);
      open.push(data.open);
      high.push(data.high);
      low.push(data.low);
      volume.push(data.volume);
    }

    let trace = {
      x: date,
      close: close,
      open: open,
      high: high,
      low: low,
      increasing: {line: {color: this.increasingColor},
                   name: ''}, 
      decreasing: {line: {color: this.decreasingColor},
                   name: ''},
      line: {color: 'rgba(31,119,180,1)'}, 
      type: 'candlestick',
      name: '',
      xaxis: 'x', 
      yaxis: 'y2'
    }

    let volumeColors = [];
    for(let i in close) {
      if(+i > 0) {
          if(close[+i] > close[+i-1]){
            volumeColors.push(this.increasingColor);
          } else {
            volumeColors.push(this.decreasingColor)
          }
      } else {
        volumeColors.push(this.decreasingColor)
      }
    }
    let volumeTrace = {
      x: date,
      y: volume,                         
      marker: {color: volumeColors},
      type: 'bar',
      yaxis:'y',
      name:''
    }

    let element = this.el.nativeElement;
    let data = [trace, volumeTrace];
    let layout = {
      dragmode: 'zoom',
      title: buySymbol + '/' + sellSymbol,
      showlegend: false,
      xaxis: {
        autorange: true,
        rangeselector: {buttons: [
          {
            count: 1,
            label: '1h',
            step: 'hour',
            stepmode: 'backward'
          },
          {
            count: 24,
            label: '24h',
            step: 'hour',
            stepmode: 'backward'
          },
          {
            count: 7,
            label: '7d',
            step: 'day',
            stepmode: 'backward'
          },
          {
            count: 14,
            label: '14d',
            step: 'day',
            stepmode: 'backward'
          },
          {step: 'all'}
        ]},
        title: 'Time', 
        type: 'date',
        rangeslider: {
           visible: false
        },
      }, 
      yaxis: {
        domain: [0., 0.2],
        autorange: true
      },
      yaxis2: {
        type: 'linear',
        autorange: true, 
        title: buySymbol + '/' + sellSymbol,
        domain: [0.25, 1]
      }

    };

    Plotly.newPlot(element, data, layout);

    window.onresize = () => {
      Plotly.Plots.resize(element);
    }
  }

  convertToOHLC(data: Array<any>) { 
    data.sort((a, b) => d3.ascending(a.timestamp, b.timestamp));
    let result = [];
    let format = d3.timeFormat("%Y-%m-%d");
    data.forEach(d => d.timestamp = format(new Date(d.timestamp * 1000)));
    let allDates = [...Array.from(new Set(data.map(d => d.timestamp)))];
    allDates.forEach(d => {
        let tempObject = {};
        let filteredData = data.filter(e => e.timestamp === d);

        tempObject['timestamp'] = d;
        tempObject['volume'] = d3.sum(filteredData, e=> e.volume);
        tempObject['open'] = filteredData[0].price;
        tempObject['close'] = filteredData[filteredData.length - 1].price;
        tempObject['high'] = d3.max(filteredData, e => e.price);
        tempObject['low'] = d3.min(filteredData, e => e.price);
        result.push(tempObject);
    });
    return result;
  };
}