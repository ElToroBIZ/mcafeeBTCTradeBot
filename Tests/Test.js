const Binance  = require('../Exchanges/binance'),
      Bittrex  = require('../Exchanges/bittrex'),
      Poloniex = require('../Exchanges/poloniex');
      Yobit    = require('../Exchanges/yobit'),
      config   = require('../config');



let { poloniex,
      binance,
      bittrex,
      yobit,
      usePolo,
      useBinance,
      useBittrex,
      useYobit
  } = config;

if (usePolo) {
  const POLO = new Poloniex(poloniex);
  console.log('Sending Poloniex Buy Request');
  POLO.checkBalancesandBuy('LTC');
}

if (useBinance) { //My connection was too slow to test this, could somone please post feedback(if it works) on github issues
  const BINANCE = new Binance(binance);
  console.log('Sending Binance Buy Request');
  BINANCE.checkPriceAndBuy('LTC');
}

if (useBittrex) { //Not TESTED I Dont Have API KEY, please post feedback on github issues
  const BITTREX = new Bittrex(bittrex);
  console.log('Sending Bittrex Buy Request');
  BITTREX.getSpecificSummaryAndBuy('LTC');
}

if (useYobit) {
  const YOBIT = new Yobit(yobit);
  console.log('Sending Yobit buy request');
  YOBIT.getPricenBuy('LTC')
}
