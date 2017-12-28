const Binance  = require('../Exchanges/binance'),
      Bittrex  = require('../Exchanges/bittrex'),
      Poloniex = require('../Exchanges/poloniex');
      config   = require('../config');

let { poloniex,
      binance,
      bittrex,
      usePolo,
      useBinance,
      useBittrex } = config;

if (usePolo) {
  const POLO = new Poloniex(poloniex);
  POLO.checkBalancesandBuy('LTC');
}

if (useBinance) { //My connection was too slow to test this, could somone please post feedback(if it works) on github issues
  const BINANCE = new Binance(binance);
  BINANCE.checkPriceAndBuy('LTC');
}

if (useBittrex) { //Not TESTED I Dont Have API KEY, please post feedback on github issues
  const BITTREX = new Bittrex(bittrex);
  BITTREX.getSpecificSummaryAndBuy('LTC');
}
