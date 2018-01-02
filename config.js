//Feel free to send me a Bitcoin Cash donation here (1NLkGPnNbT9iCJ35U9UfsURANtYgNREVtq) or email me if you want to send me something else and I will respond with an address.

module.exports = {
  usePolo: true,
  useBinance: false,
  useBittrex: false,
  useYobit: false,
  poloniexSafeMode: true, // Set to true if you want to not buy if price is above variance(set inside poloniex object);
  poloniex: {
    API_KEY: 'asdf',
    SECRET: 'asdf',
    buyAmount: .0008, /* these are my preset values ..these are too be changed */
    markup: 1.01, //1% markup { NOTE NEW FORMAT ! }
    resell: true,
    sellmarkup: 1.1,
    variance: 10
  },
  binance: {
    API_KEY: 'a',
    SECRET: 'a',
    variance: 10,
    markup: .01,
    btcSpending: .008
  },
  bittrex: {
    API_KEY: 'a',
    SECRET: 'a',
    variance: 10,
    markup: .01,
    btcSpending: .008
  },
  yobit: {
    API_KEY: 'asdf',
    SECRET: 'asdf',
    variance: 100,
    markup: 0,
    btcSpending: .008
  },
  twit: {
    consumer_key: '',
    consumer_secret: '',
    access_token: '-',
    access_token_secret: ''
  }
}

/*
  usePolo: set true if you want the event to buy on poloniex
  useBinance: set true if you want the event to buy on binance,
  useBittrex: set true if you want the event to buy on Bittrex (setting all 3 to true will buy on all 3 async);
  API_KEY: given
  SECRET: given,
  buyAmount / btcSpending: The amount of bitcoin you want to spend on tweeted coin
  markup: The % over market price you want to send buy reqest for. .01 = 1% etc
  variance: If the price has changed over ${variance}% in the past 24 hours it wont change. For example if the price shoots up 11% after tweet but you set variance at 10% then it wont buy to protect buyAmount
  resell: (only on polo): set to true if you want to resell it
  sellmarkup: the markup at what you want to resell it at, 1.1 = 10% more
  twit: consumer_key, consumer_secret, access_token, access_token_secret all from twitter
*/
