//////////////////////////////
//// APP LOGIC GOES HERE ////
////////////////////////////

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(() => {
    console.log("Service worker registered");
  });
}

// Add currencies to option elements on DOM
const populateCurrencyOptions = currencies => {
  // Get elements from DOM
  const fromCurrency = document.getElementById("fromCurrency");
  const toCurrency = document.getElementById("toCurrency");

  // Append currencies to Select elements on DOM
  currencies.forEach(currency => {
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
};

// Fetch all currencies
const fetchCurrencies = () => {
  return fetch("https://free.currencyconverterapi.com/api/v5/currencies")
    .then(response => response.json())
    .then(currencies => {
      // Sort object keys alphabetically into an array
      const sortedCurrencyKeys = Object.keys(currencies.results).sort();

      const sortedCurrencies = sortedCurrencyKeys.map(key => {
        const currencyObject = new Object();
        currencyObject[key] = currencies.results[key].currencyName;

        return currencyObject;
      });
      storeCurrencies(sortedCurrencies);
      return sortedCurrencies;
    })
    .catch(err => {
      console.log(err);
    });
};

// Convert amount from one currency to another
const convert = (exchangeRate, amount, toCurrency) => {
  if (!exchangeRate && navigator.onLine) {
    return `<p>No connectivity</p>`;
  }
  let convertedAmount = amount * exchangeRate;
  convertedAmount = `${toCurrency} ${Number(
    convertedAmount.toFixed(2)
  ).toLocaleString()}`;
  return convertedAmount;
};

document
  .getElementById("currencyConverterForm")
  .addEventListener("submit", e => {
    e.preventDefault();
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const amount = document.getElementById("amount").value;
    const query = `${fromCurrency}_${toCurrency}`;

    // Add is-loading class to button
    document.getElementById("submitButton").classList.add("is-loading");

    fetch(
      `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`
    )
      .then(response => response.json())
      .then(res => {
        // Store exchange rate to indexedDB
        storeExchangeRates(res);

        const exchangeRate = Object.values(res)[0];

        // Convert amount
        const convertedAmount = convert(exchangeRate, amount, toCurrency);

        // Display converted amount in DOM
        document.getElementById("showConversion").innerHTML = convertedAmount;

        // Remove is-loading class
        document.getElementById("submitButton").classList.remove("is-loading");
      })
      .catch(err => {
        console.log(err);
        fetchExchangeRates(query)
          .then(exchangeRate => {
            return convert(exchangeRate, amount, toCurrency);
          })
          .then(convertedAmount => {
            // Display converted amount in DOM
            document.getElementById(
              "showConversion"
            ).innerHTML = convertedAmount;

            // Remove is-loading class
            document
              .getElementById("submitButton")
              .classList.remove("is-loading");
          });
      });
  });

fetchCurrencies()
  .then(currencies => populateCurrencyOptions(currencies))
  .catch(err => {
    console.log("Fetching from database");
    fetchCurrenciesIDB().then(currencies =>
      populateCurrencyOptions(currencies)
    );
  });

removeOldExchangeRates();
