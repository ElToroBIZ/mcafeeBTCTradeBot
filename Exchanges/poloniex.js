const Poloniex = require('poloniex-api-node');


class polo {
  constructor({ API_KEY, SECRET, buyAmount, markup, resell, sellmarkup, variance }) {
    this.API_KEY    = API_KEY;
    this.SECRET     = SECRET;
    this.buyAmount  = buyAmount;
    this.markup     = markup; //should be .01 - .05; ##IMPORTANT##
    this.resell     = resell
    this.sellmarkup = sellmarkup; /* 1.05 = 5% markup, 1.1 = 10% markup, 2 = 2x price. */
    this.variance   = variance;
    this.poloniex   = new Poloniex(this.API_KEY, this.SECRET);
  }

  checkBalancesandBuy(val) {
    this.poloniex.returnBalances()
    .then(balance => {
      if (balance.BTC >= this.buyAmount) {
        const currencyPair = `BTC_${val}`;
        this.poloniex.returnOrderBook(currencyPair, 1)
        .then(result => {
          let buyPrice = result.asks[0][0] * this.markup;
          this.buy(buyPrice, currencyPair);
        }).catch(err => console.log(err));
      } else { console.log('Your balance is too small'); }
    }).catch(err => console.log(`ERR :: ${err} :: { POLO }`));
  }

  buy(buyprice, currencyPair) {
    var amount = (this.buyAmount / buyprice).toFixed(4);
    this.poloniex.buy(currencyPair, buyprice, amount, false, false, false)
    .then(result => {
      console.log(`Made Purchase ${JSON.stringify(result)} :: { POLO }`);
      if (this.resell) {
        let amountPurchased = 0;
        for (let i = 0; i < result.resultingTrades.length; i++) {
          amountPurchased += result.resultingTrades[i].amount;
        }
        amountPurchased = (amountPurchased - (amountPurchased * 0.003)).toFixed(14);
        this.sell(buyprice, currencyPair, amountPurchased);
      }
    }).catch(err => console.log(`${err} :: { POLO }`));
  }

  sell(sellprice, currencyPair, amount) {
    sellprice = sellprice * this.sellmarkup;
    console.log(`Selling now :: Sell price: ${sellprice} :: currencyPair: ${currencyPair} :: Amount : ${amount} :: { POLO }`);
    this.poloniex.sell(currencyPair, sellprice, amount, false, false, false)
    .then(sell => console.log(sell))
    .catch(err => console.log(err));
  }

  chartData(val) {
    val = val.toUpperCase();
    this.poloniex.returnTicker()
    .then(ticker => {
      console.log(ticker.val);
      var { percentChange, lowestAsk } = ticker[`BTC_${val}`];
      val = `BTC_${val}`;
      percentChange = percentChange * 100;
      if (percentChange > this.variance) { console.log('Too much variance in price, not buying :: { POLO }')}
      else {
        let buyPrice = lowestAsk * this.markup;
        this.buy(buyPrice, val);
      }
    }).catch(err => console.log(`err :: ${err} :: { POLO }`))
  }
}

module.exports = polo;

/*
Sending Poloniex Buy Request
Made Purchase {"orderNumber":"","resultingTrades":[{"amount":"0.04380000","date":"2018-01-02 05:18:57","rate":"0.01806489","total":"0.00079124","tradeID":"","type":"buy"}]} :: { POLO }
Selling now :: Sell price: 0.02007009279 :: currencyPair: BTC_LTC :: Amount : 0.04366860000000 :: { POLO }
{ orderNumber: '', resultingTrades: [] }

*/
