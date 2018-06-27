//////////////////////////////
//// APP LOGIC GOES HERE ////
////////////////////////////

// Fetch all currencies
fetch("https://free.currencyconverterapi.com/api/v5/currencies")
  .then(response => response.json())
  .then(currencies => {
    // Sort object keys alphabetically into an array
    const sortedCurrencyKeys = Object.keys(currencies.results).sort();

    const sortedCurrencies = sortedCurrencyKeys.map(key => {
      const currencyObject = new Object();
      currencyObject[key] = currencies.results[key].currencyName;

      return currencyObject;
    });

    console.log(sortedCurrencies);
  });
