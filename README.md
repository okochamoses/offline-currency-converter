# offline-currency-converter

A currency converter that implements offline-first technology and acts as a progressive web app.

App Url: https://okochamoses.github.io/

# Brief

-Application works by fetching static data and storing it to the cache for offline use.

-Currencies converted have their exchange rates stored to IndexedDB and kept for use while the app is offline.

-Exchange rates that are in the database for over an hour are purged from indexedDB as the currency api updates its rates every hour.
This will help avoid errors and make the app more efficient in it's calculations.

-The api from which currencies and exchage rates are fetched is : https://free.currencyconverterapi.com/

-The api used for handling indexedDB queries is "IndexedDB promised": https://www.npmjs.com/package/idb

-The app logic is implemented in javascript(es6), no libraries or frameworks were used, not even jquery (..insert smiley face here)

-The app uses the Bulma for styling.
