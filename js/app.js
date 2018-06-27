//////////////////////////////
//// APP LOGIC GOES HERE ////
////////////////////////////

// Fetch all currencies
const fetchCurrencies = () => {
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

      // Get elements from DOM
      const fromCurrency = document.getElementById("fromCurrency");
      const toCurrency = document.getElementById("toCurrency");

      // Append currencies to Select elements on DOM
      sortedCurrencies.forEach(currency => {
        const fromCurrencyOption = document.createElement("option");
        const toCurrencyOption = document.createElement("option");
        for (const item in currency) {
          fromCurrencyOption.text = toCurrencyOption.text = `${item} (${
            currency[item]
          })`;
          fromCurrencyOption.value = toCurrencyOption.value = item;
        }
        fromCurrency.appendChild(fromCurrencyOption);
        toCurrency.appendChild(toCurrencyOption);
      });
    })
    .catch(err => {
      console.log(err);
    });
};

fetchCurrencies();
