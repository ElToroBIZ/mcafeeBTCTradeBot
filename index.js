const Twit   = require('twit'),
      vision = require('@google-cloud/vision'),
      names  = require('./names.js'),
      config = require('./config');

//Exchanges
const Binance  = require('./Exchanges/binance'),
      Bittrex  = require('./Exchanges/bittrex'),
      Poloniex = require('./Exchanges/poloniex'),
      Yobit    = require('./Exchanges/yobit');

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './googlekeys/googlevision1.json';
// process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './googlekeys/googleExample.json';

var IDChecked = [];     /* Dont Change this value */
var CoinsBought = [];   /* Dont Change this value */
const safeCheck = true;

let { poloniex,
      binance,
      bittrex,
      yobit,
      usePolo,
      useBinance,
      useBittrex,
      useYobit,
      twit
  } = config;

if (usePolo) {
  var POLO = new Poloniex(poloniex);
}
if (useBinance) {
  var BINANCE = new Binance(binance);
}
if (useBittrex) { //see notes in Tests.js
  var BITTREX = new Bittrex(bittrex);
}
if (useYobit) {
  var YOBIT = new Yobit(yobit);
}

const gImage = new vision.ImageAnnotatorClient();
const T      = new Twit(twit);
const stream = T.stream('statuses/filter', { follow : '961445378' });


stream.on('tweet', (tweet, err) => {
  console.log(tweet);
  if (validate(tweet) && tweet.user.id_str === '961445378' && !isIn(tweet.id, IDChecked)) {
    if (tweet.text.match(/https:\/\/t.co\/[^\s]+/)) {
      let image = tweet.entities.media[0].media_url;
      gImage.textDetection(image)
      .then(result => {
        console.log(result);
        let text = result[0].fullTextAnnotation.text;
        checkTweet(text.slice(0, 20), tweet.text)
      }).catch(err => console.log(`Err with google text ${err}`));
    } else {
      console.log('No image found in tweet, ignoring');
    }
  } else {
    console.log('Error in Validating Tweet');
  }
});


//functions
function checkTweet(text, tweet){
  text = text.toLowerCase();
  if (safeCheck) {
    for (var val of names) {
      val = val.toLowerCase();
      if (text.includes(val) && tweet.includes('coin of the week')) {
        console.log(`${text} :: ${val}`);
        if (!isIn(val, CoinsBought)) {
          buy(val.toUpperCase());
        }
      }
    }
  } else {
    for (var val of names) {
      val = val.toLowerCase();
      if (text.includes(val)) {
        console.log(`${text} :: ${val}`);
        if (!isIn(val, CoinsBought)) {
          buy(val.toUpperCase());
        }
      }
    }
  }
}

function isIn(id, array) {
  for (var val of array) {
    if (val === id) {
      return true;
    }
  }
  array.push(id);
  return false;
}

function validate(twitter_response) {
 let {
   in_reply_to_status_id,
   in_reply_to_status_id_str,
   in_reply_to_user_id,
   in_reply_to_user_id_str,
   in_reply_to_screen_name
 } = twitter_response;

 if (!in_reply_to_status_id && !in_reply_to_status_id_str && !in_reply_to_user_id && !in_reply_to_user_id_str && !in_reply_to_screen_name) {
   return true;
 } else {
   console.log('Tweet is not valid');
   return false;
 }
}

function buy(val) {
  if (usePolo) {
      POLO.checkBalancesandBuy(val);
  }
  if (useBinance) { //also see notes in Tests.js
    BINANCE.checkPriceAndBuy(val);
  }
  if (useBittrex) { //see notes in Tests.js
    BITTREX.getSpecificSummaryAndBuy(val);
  }
  if (useYobit) {
    YOBIT.getPricenBuy(val);
  }
}
