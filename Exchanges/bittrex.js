const bittrex = require('node-bittrex-api');

class Bittrex {
  constructor({ API_KEY, SECRET, variance, markup, btcSpending }) {
    this.bittrex = bittrex;
    this.bittrex.options({
      'apikey' : API_KEY,
      'apisecret' : SECRET
    });
    this.variance = variance; // 11 = 11% change in the day so anything under 11 is allowed
    this.markup = markup; // 0.01 = 1% markup
    this.btcSpending = btcSpending;
  }

  allowBuy(low, high) {
    let pctchange = (((high/low) - 1) * 100).toFixed(5);
    console.log(`PctChange: ${pctchange} :: Variance :: ${this.variance} :: { BITTREX }`);
    return this.variance > pctchange;
  }

  getGeneralSummary() {
    return new Promise((resolve, reject) => {
      this.bittrex.getmarketsummaries((err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  }

  getSpecificSummaryAndBuy(currencyPair) {
    let mkt = { market : `BTC-${currencyPair}`};
    this.bittrex.getmarketsummary(mkt, (data, err) => {
      //console.log(data);
      let { Low, High, Ask } = data.result[0];
      if (this.allowBuy(Low, High)) {
        let buyPrice = Ask + Ask * this.markup;
        this.buy(currencyPair, buyPrice);
      } else {
        console.log(`Buy Terminated :: Too much action { BITTREX }`);
      }
    });
  }

  getOrderBook(currencyPair) {
    return new Promise((resulve, reject) => {
      let data = { market: `BTC-${currencyPair}`, depth: 3, type: 'sell'};
      this.bittrex.getorderbook(data, (data, err) => {
        err ? reject(err) : resolve(data);
      })
    })
  }

  buy(currencyPair, buyPrice) {
    let amtToPurchase = (this.btcSpending / buyPrice).toFixed(5);
    this.bittrex.tradebuy({
      MarketName: `BTC-${currencyPair}`,
      OrderType: 'LIMIT',
      Quantity: amtToPurchase,
      Rate: buyPrice,
      TimeInEffect: 'FILL_OR_KILL', // supported options are 'IMMEDIATE_OR_CANCEL', 'GOOD_TIL_CANCELLED', 'FILL_OR_KILL'
      ConditionType: 'NONE',        // supported options are 'NONE', 'GREATER_THAN', 'LESS_THAN'
      Target: 0,                    // used in conjunction with ConditionType
    }, (buy, err) => {
      if (err) {
        console.log(`ERR in buy :: ${JSON.stringify(err)} :: { BITTREX }`);
      } else {
        console.log(`Buy Success :: ${JSON.stringify(buy)} :: { BITTREX }`);
      }
    });
  }

  sell() {
    return false; //dont have API key & registration is closed (need to see what callback buy is in buy :( );
  }
}

module.exports = Bittrex;
