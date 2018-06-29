//////////////////////////////
//// APP LOGIC GOES HERE ////
////////////////////////////

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(() => {
    console.log("Service worker registered");
  });
}

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
        const exchangeRate = Object.values(res)[0];
        let convertedAmount = amount * exchangeRate;

        convertedAmount = `${toCurrency} ${Number(
          convertedAmount.toFixed(2)
        ).toLocaleString()}`;

        // Display converted amount in DOM
        document.getElementById("showConversion").innerHTML = convertedAmount;

        // Remove is-loading class
        document.getElementById("submitButton").classList.remove("is-loading");
      })
      .catch(err => {
        console.log(err);
        // Remove is-loading class
        document.getElementById("submitButton").classList.remove("is-loading");
      });
  });
