self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open("currency-converter-v1")
      .then(cache => {
        cache.addAll([
          "./index.html",
          "./js/app.js",
          "./js/idb.js",
          "./js/idb-service.js",
          "./images/logo.png",
          "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css"
        ]);
      })
      .catch(err => console.log(err))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request);
      }
    })
  );
});
