const api = require('binance');

class binance {
  constructor({ API_KEY, SECRET, variance, markup, btcSpending }) {
    this.API_KEY = API_KEY;
    this.SECRET = SECRET;
    this.exchange = new api.BinanceRest({
      key: this.API_KEY,
      secret: this.SECRET,
      timeout: 30000,
      recvWindow: 10000000,
      disableBeautification: false
    });
    this.variance = variance;
    this.markup = markup; // 0.01 = 1% markup
    this.btcSpending = btcSpending;
  }

  getAll() {
    console.log(`${this.API_KEY} ${this.SECRET} ${this.variance} ${this.markup} ${this.btcSpending}`);
  }

  checkPriceAndBuy(currencyPair) {
    let queryObj = {
      symbol: `${currencyPair}BTC`,
    }
    this.exchange.ticker24hr(queryObj)
    .then(result => {
      console.log('got ticker');
      let { priceChangePercent, askPrice } = result;
      if (this.variance > priceChangePercent) {
        let buyPrice = askPrice + askPrice * this.markup;
        this.buy(buyPrice, currencyPair);
      } else {
        console.log('Price already shot up, not purchasing');
      }
    }).catch(err => console.log(err));
  }

  buy(buyPrice, currencyPair) {
    //newOrder(query object, [callback function])
    let qty = (this.btcSpending / buyPrice).toFixed(5);
    let buyObj = {
      symbol: `${currencyPair}BTC`,
      side: 'BUY',
      type: 'LIMIT',
      timeInForce: 'IOC', //immediate or cancelled
      quantity: qty,
      price: buyPrice,
      timestamp: Math.round((new Date()).getTime() / 1000),
      recvWindow: 10000000
    }
    this.exchange.newOrder(buyObj)
    .then(success => console.log(success))
    .catch(err => console.log(`ERR in buy ${JSON.stringify(err)}`))
  }
}

module.exports = binance;
