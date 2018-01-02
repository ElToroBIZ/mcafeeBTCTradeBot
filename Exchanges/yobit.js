const Yobit = require('yobit'); //made the best of module yobit :/


class yobit {
  constructor({ API_KEY, SECRET, variance, markup, btcSpending }) {
    this.api_key = API_KEY;
    this.secret  = SECRET;
    this.variance = variance;
    this.markup = markup;
    this.btcSpending = btcSpending;
    this.publicClient = new Yobit(this.api_key, this.secret);
  }

  getPricenBuy(currencyPair) {
    currencyPair = currencyPair.toLowerCase();
    this.publicClient.getTicker(this.parsePrice.bind(this, currencyPair), `${currencyPair}_btc`);
  }

  parsePrice(currencyPair, err, obj) {
    if (!err) {
      for (let item in obj) {
        var { low, last, sell } = obj[item];
      }
      let pctchange = (((last/low) - 1) * 100).toFixed(5);
      if (pctchange > this.variance) { console.log('Too much variance not buying :: { YOBIT }'); }
      else {
        let buyPrice = (sell + sell * this.markup).toFixed(10);
        let amtToPurchase = (this.btcSpending / buyPrice).toFixed(5);
        this.buy(buyPrice, amtToPurchase, currencyPair);
      }

    } else { console.log(`ERR getting price: ${JSON.stringify(err)} :: { YOBIT }`)}
  }

  buy(buyPrice, amtToPurchase, currencyPair) {
    currencyPair = `${currencyPair}_btc`;
    this.publicClient.addTrade(this.buyResult, currencyPair, 'buy', amtToPurchase, buyPrice);
  }

  buyResult(err, result) {
    console.log(`DATA FROM BUY: ${JSON.stringify(err)} :: ${JSON.stringify(result)} :: { YOBIT }`);
  }
}

module.exports = yobit;
