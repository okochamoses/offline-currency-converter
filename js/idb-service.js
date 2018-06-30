const dbConnect = idb.open("currency-converter-store", 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore("currencies");
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
