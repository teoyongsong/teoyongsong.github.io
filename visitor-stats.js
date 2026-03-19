(function () {
  "use strict";

  // Global accumulative counters (shared across visitors)
  var API_BASE = "https://api.counterapi.dev/v1";
  var NAMESPACE = "teoyongsong-github-io";
  var VISITOR_COUNTER = "site-visitors";
  var LIKE_COUNTER = "site-likes";

  // Local flags to prevent duplicate events from the same device/session
  var LIKE_FLAG = "liked-teoyongsong-site";
  var VISIT_FLAG = "counted-teoyongsong-visit";

  var visitorEl = document.getElementById("visitor-count");
  var likeEl = document.getElementById("like-count");
  var likeBtn = document.getElementById("like-btn");
  var msgEl = document.getElementById("engagement-message");

  if (!visitorEl || !likeEl || !likeBtn || !msgEl) return;

  function setMessage(text) {
    msgEl.textContent = text || "";
  }

  function getUrl(name, action) {
    if (action) return API_BASE + "/" + NAMESPACE + "/" + name + "/" + action;
    return API_BASE + "/" + NAMESPACE + "/" + name + "/";
  }

  function requestJSON(url) {
    return fetch(url, { cache: "no-store" }).then(function (res) {
      return res.json();
    });
  }

  function getCount(name) {
    return requestJSON(getUrl(name)).then(function (data) {
      if (typeof data.count === "number") return data.count;
      if (data && data.code === 400) return 0; // "record not found"
      throw new Error("Failed to load count");
    });
  }

  function increment(name) {
    return requestJSON(getUrl(name, "up")).then(function (data) {
      if (typeof data.count === "number") return data.count;
      throw new Error("Failed to increment count");
    });
  }

  function refreshCounts() {
    getCount(VISITOR_COUNTER)
      .then(function (count) {
        visitorEl.textContent = String(count);
      })
      .catch(function () {
        visitorEl.textContent = "--";
        setMessage("Unable to load visitor count right now.");
      });

    getCount(LIKE_COUNTER)
      .then(function (count) {
        likeEl.textContent = String(count);
      })
      .catch(function () {
        likeEl.textContent = "--";
        if (!msgEl.textContent) setMessage("Unable to load like count right now.");
      });
  }

  function countVisitOncePerSession() {
    if (sessionStorage.getItem(VISIT_FLAG) === "1") {
      refreshCounts();
      return;
    }

    increment(VISITOR_COUNTER)
      .then(function (count) {
        visitorEl.textContent = String(count);
        sessionStorage.setItem(VISIT_FLAG, "1");
        return getCount(LIKE_COUNTER);
      })
      .then(function (count) {
        likeEl.textContent = String(count);
      })
      .catch(function () {
        refreshCounts();
      });
  }

  if (localStorage.getItem(LIKE_FLAG) === "1") {
    likeBtn.disabled = true;
    likeBtn.textContent = "Liked";
    setMessage("Thanks! You already liked this site on this device.");
  }

  likeBtn.addEventListener("click", function () {
    if (localStorage.getItem(LIKE_FLAG) === "1") return;

    likeBtn.disabled = true;
    setMessage("Updating likes...");

    increment(LIKE_COUNTER)
      .then(function (count) {
        likeEl.textContent = String(count);
        localStorage.setItem(LIKE_FLAG, "1");
        likeBtn.textContent = "Liked";
        setMessage("Thanks for the like!");
      })
      .catch(function () {
        likeBtn.disabled = false;
        setMessage("Could not update likes. Please try again.");
      });
  });

  countVisitOncePerSession();
})();


