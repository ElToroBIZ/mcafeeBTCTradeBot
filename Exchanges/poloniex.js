const Poloniex = require('poloniex-api-node');


class polo {
  constructor({ API_KEY, SECRET, buyAmount, markup, resell, sellmarkup }) {
    this.API_KEY    = API_KEY;
    this.SECRET     = SECRET;
    this.buyAmount  = buyAmount;
    this.markup     = markup; //should be .01 - .05; ##IMPORTANT##
    this.resell     = resell
    this.sellmarkup = sellmarkup; /* 1.05 = 5% markup, 1.1 = 10% markup, 2 = 2x price. */
    this.poloniex   = new Poloniex(this.API_KEY, this.SECRET);
  }

  checkBalancesandBuy(val) {
    this.poloniex.returnBalances()
    .then(balance => {
      if (balance.BTC >= this.buyAmount) {
        const currencyPair = `BTC_${val}`;
        this.poloniex.returnOrderBook(currencyPair, 1)
        .then(result => {
          let buyPrice = result.asks[0][0] + result.asks[0][0] * this.markup;
          this.buy(buyPrice, currencyPair);
        }).catch(err => console.log(err));
      }
    }).catch(err => console.log(err));
  }

  buy(buyprice, currencyPair) {
    const amount = this.buyAmount / buyprice;
    this.poloniex.buy(currencyPair, buyprice, amount.toFixed(4), false, false, false)
    .then(result => {
      console.log(`Made Purchase ${JSON.stringify(result)} :: { POLO }`);
      if (this.resell) {
        let amountPurchased = 0;
        for (let i = 0; i < result.resultingTrades.length; i++) {
          amountPurchased += result.resultingTrades[i].amount;
        }
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
}

module.exports = polo;
