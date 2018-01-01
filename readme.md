Hello,

Welcome to my project, feel free to send me an email at nateKM1@protonmail.com.

Feel free to send me a Bitcoin Cash donation here (1NLkGPnNbT9iCJ35U9UfsURANtYgNREVtq)
or email me if you want to send me something else and I will respond with an address. Even if its just a small amount I would really appreciate it.

/* TESTERS NEEDED  */
Curently Supports Poloniex. (I need individuals to use my Tests.js file to test Binance, Bittrex, YoBit (no api keys for one, and internet to slow to test the other so need some community support).

Steps to use.
  1. Fill out config.js file
    Feel free not to fill out an exchange if it is set to false, however set it to true and fill out data if you want to buy on said exchange. If you fill out all 3 the bot will buy on all 3 exchanges async.
    You can get the twitter keys here: https://apps.twitter.com
  2. Google Image Auth (see https://cloud.google.com/vision/docs/quickstart)
    Once you sign up for google, create a file in the "googlekeys" directory named "googlevision1.json" and paste the auth json you downloaded there
  3. Run test file
  ```shell
    {once in project directory}
    npm install
    cd Tests
    node Test.js
  ```
  4. Once you verify all exchanges work feel free to use it on money mondays.
  ```shell
   {once in project directory}
   npm install
   node index.js
  ```
  and thats it your running!


If you are using yobit, YOU MUST MAKE THESE CHANGES.

After installing click on node_modules folder > click on yobit folder > click on index.js go to line 267, remove their addTrade and add this
Yobit.prototype.addTrade = function addTrade(callback, symbol, type, amount, price)
{
    var params = {
        pair: symbol,
        type: type
    }

    if (amount) params.amount = amount
    if (price) params.price = price

    this.privateRequest('Trade', params, callback)
}
