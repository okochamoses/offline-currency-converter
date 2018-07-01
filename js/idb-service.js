////////////////
// Currencies//
//////////////

const dbConnect = idb.open("currency-converter-store", 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore("currencies");
      upgradeDB.createObjectStore("exchange-rates");
  }
});

const storeCurrencies = currencyArray => {
  return dbConnect
    .then(db => {
      const tx = db.transaction("currencies", "readwrite");
      const store = tx.objectStore("currencies");

      store.put(currencyArray, "currencyArray");
    })
    .catch(err => console.log(`Error saving to database: ${err}`));
};

const fetchCurrenciesIDB = () => {
  return dbConnect
    .then(db => {
      const currencies = db.transaction("currencies").objectStore("currencies");
      return currencies.getAll().then(currencyArray => currencyArray[0]);
    })
    .catch(err => console.log(err));
};

/////////////////////
// Exchange rates //
///////////////////

const storeExchangeRates = exchangeRate => {
  return dbConnect
    .then(db => {
      const tx = db.transaction("exchange-rates", "readwrite");
      const store = tx.objectStore("exchange-rates");

      // Define IDB entry values
      const currency = Object.keys(exchangeRate)[0];
      const rate = Object.values(exchangeRate)[0];
      const time = Date.now();

      const rateObject = new Object();
      rateObject.rate = rate;
      rateObject.time = time;
      store.put(rateObject, currency);
    })
    .catch(err => console.log(`Error saving to database: ${err}`));
};

const fetchExchangeRates = currencyPair => {
  return dbConnect
    .then(db => {
      const rates = db
        .transaction("exchange-rates")
        .objectStore("exchange-rates");
      return rates.get(currencyPair).then(data => data.rate);
    })
    .catch(err => console.log(err));
};

const removeOldExchangeRates = () => {
  return dbConnect.then(db => {
    const rates = db.transaction("exchange-rates", "readwrite");
    rates
      .objectStore("exchange-rates")
      .getAllKeys()
      .then(keys => {
        const oldExchangeRates = new Array();
        for (const key of keys) {
          rates
            .objectStore("exchange-rates")
            .get(key)
            .then(currency => {
              const createdAt = currency.time;
              const oneHour = 3600 * 1000; // milliseconds in an hour
              const maxExistTime = createdAt + oneHour;
              const now = Date.now();

              if (maxExistTime < now) {
                return rates.objectStore("exchange-rates").delete(key);
              }
            })
            .catch(err => console.log(err));
        }
        // oldExchangeRates;
        oldExchangeRates.forEach(x => console.log(x));
      });
  });
};
