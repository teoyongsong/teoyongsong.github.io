(function () {
  "use strict";

  var NAMESPACE = "teoyongsong-github-io";
  var VISITOR_KEY = "site-visitors";
  var LIKE_KEY = "site-likes";
  var LIKE_FLAG = "liked-teoyongsong-site";
  var VISIT_FLAG = "counted-teoyongsong-visit";

  var LOCAL_VISITOR_TOTAL = "local-site-visitors-total";
  var LOCAL_LIKE_TOTAL = "local-site-likes-total";

  var API_BASES = ["https://api.countapi.xyz", "https://countapi.xyz"];

  var visitorEl = document.getElementById("visitor-count");
  var likeEl = document.getElementById("like-count");
  var likeBtn = document.getElementById("like-btn");
  var msgEl = document.getElementById("engagement-message");

  if (!visitorEl || !likeEl || !likeBtn || !msgEl) return;

  var remoteAvailable = true;

  function getInt(value) {
    var n = parseInt(String(value || "0"), 10);
    return Number.isFinite(n) ? n : 0;
  }

  function setMessage(text) {
    msgEl.textContent = text || "";
  }

  function getLocalCount(key) {
    return getInt(localStorage.getItem(key));
  }

  function setLocalCount(key, value) {
    localStorage.setItem(key, String(getInt(value)));
  }

  function incrementLocalCount(key) {
    var next = getLocalCount(key) + 1;
    setLocalCount(key, next);
    return next;
  }

  function requestCountApi(path) {
    var index = 0;

    function tryNext() {
      if (index >= API_BASES.length) {
        return Promise.reject(new Error("Count API unavailable"));
      }

      var base = API_BASES[index++];
      return fetch(base + path, { cache: "no-store" }).then(function (res) {
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }
        return res.json();
      }).catch(function () {
        return tryNext();
      });
    }

    return tryNext();
  }

  function apiGet(key) {
    return requestCountApi("/get/" + NAMESPACE + "/" + key);
  }

  function apiHit(key) {
    return requestCountApi("/hit/" + NAMESPACE + "/" + key);
  }

  function renderCounts(visitors, likes) {
    visitorEl.textContent = String(getInt(visitors));
    likeEl.textContent = String(getInt(likes));
  }

  function loadCounts() {
    if (!remoteAvailable) {
      renderCounts(getLocalCount(LOCAL_VISITOR_TOTAL), getLocalCount(LOCAL_LIKE_TOTAL));
      return;
    }

    Promise.all([apiGet(VISITOR_KEY), apiGet(LIKE_KEY)])
      .then(function (results) {
        var visitors = getInt(results[0] && results[0].value);
        var likes = getInt(results[1] && results[1].value);
        renderCounts(visitors, likes);
      })
      .catch(function () {
        remoteAvailable = false;
        renderCounts(getLocalCount(LOCAL_VISITOR_TOTAL), getLocalCount(LOCAL_LIKE_TOTAL));
        setMessage("Live counter service unavailable. Showing local device counts.");
      });
  }

  function countVisitOncePerSession() {
    if (sessionStorage.getItem(VISIT_FLAG) === "1") {
      loadCounts();
      return;
    }

    sessionStorage.setItem(VISIT_FLAG, "1");

    if (!remoteAvailable) {
      var localVisitors = incrementLocalCount(LOCAL_VISITOR_TOTAL);
      renderCounts(localVisitors, getLocalCount(LOCAL_LIKE_TOTAL));
      return;
    }

    apiHit(VISITOR_KEY)
      .then(function (data) {
        visitorEl.textContent = String(getInt(data && data.value));
        return apiGet(LIKE_KEY);
      })
      .then(function (data) {
        likeEl.textContent = String(getInt(data && data.value));
      })
      .catch(function () {
        remoteAvailable = false;
        var visitors = incrementLocalCount(LOCAL_VISITOR_TOTAL);
        renderCounts(visitors, getLocalCount(LOCAL_LIKE_TOTAL));
        setMessage("Live counter service unavailable. Showing local device counts.");
      });
  }

  if (localStorage.getItem(LIKE_FLAG) === "1") {
    likeBtn.disabled = true;
    likeBtn.textContent = "Liked";
    setMessage("Thanks! You already liked this site.");
  }

  likeBtn.addEventListener("click", function () {
    if (localStorage.getItem(LIKE_FLAG) === "1") return;

    likeBtn.disabled = true;
    setMessage("Updating likes...");

    function markLikedAndRender(value) {
      localStorage.setItem(LIKE_FLAG, "1");
      likeBtn.textContent = "Liked";
      likeEl.textContent = String(getInt(value));
      setMessage("Thanks for the like!");
    }

    if (!remoteAvailable) {
      var localLikes = incrementLocalCount(LOCAL_LIKE_TOTAL);
      markLikedAndRender(localLikes);
      setMessage("Thanks for the like! (Saved on this device)");
      return;
    }

    apiHit(LIKE_KEY)
      .then(function (data) {
        markLikedAndRender(data && data.value);
      })
      .catch(function () {
        remoteAvailable = false;
        var likes = incrementLocalCount(LOCAL_LIKE_TOTAL);
        markLikedAndRender(likes);
        setMessage("Live counter service unavailable. Like saved on this device.");
      });
  });

  countVisitOncePerSession();
})();

(function () {
  "use strict";

  var NAMESPACE = "teoyongsong-github-io";
  var VISITOR_KEY = "site-visitors";
  var LIKE_KEY = "site-likes";
  var LIKE_FLAG = "liked-teoyongsong-site";
  var VISIT_FLAG = "counted-teoyongsong-visit";

  var visitorEl = document.getElementById("visitor-count");
  var likeEl = document.getElementById("like-count");
  var likeBtn = document.getElementById("like-btn");
  var msgEl = document.getElementById("engagement-message");

  if (!visitorEl || !likeEl || !likeBtn || !msgEl) {
    return;
  }

  function setMessage(text) {
    msgEl.textContent = text || "";
  }

  function apiGet(key) {
    return fetch("https://api.countapi.xyz/get/" + NAMESPACE + "/" + key).then(function (res) {
      if (!res.ok) {
        throw new Error("Unable to read counter");
      }
      return res.json();
    });
  }

  function apiHit(key) {
    return fetch("https://api.countapi.xyz/hit/" + NAMESPACE + "/" + key).then(function (res) {
      if (!res.ok) {
        throw new Error("Unable to increment counter");
      }
      return res.json();
    });
  }

  function loadCounts() {
    apiGet(VISITOR_KEY)
      .then(function (data) {
        visitorEl.textContent = typeof data.value === "number" ? String(data.value) : "--";
      })
      .catch(function () {
        visitorEl.textContent = "--";
      });

    apiGet(LIKE_KEY)
      .then(function (data) {
        likeEl.textContent = typeof data.value === "number" ? String(data.value) : "--";
      })
      .catch(function () {
        likeEl.textContent = "--";
      });
  }

  function countVisitOncePerSession() {
    if (sessionStorage.getItem(VISIT_FLAG) === "1") {
      loadCounts();
      return;
    }

    apiHit(VISITOR_KEY)
      .then(function (data) {
        visitorEl.textContent = typeof data.value === "number" ? String(data.value) : "--";
        sessionStorage.setItem(VISIT_FLAG, "1");
      })
      .catch(function () {
        visitorEl.textContent = "--";
      })
      .finally(function () {
        apiGet(LIKE_KEY)
          .then(function (data) {
            likeEl.textContent = typeof data.value === "number" ? String(data.value) : "--";
          })
          .catch(function () {
            likeEl.textContent = "--";
          });
      });
  }

  if (localStorage.getItem(LIKE_FLAG) === "1") {
    likeBtn.disabled = true;
    likeBtn.textContent = "Liked";
    setMessage("Thanks! You have already liked this site.");
  }

  likeBtn.addEventListener("click", function () {
    if (localStorage.getItem(LIKE_FLAG) === "1") {
      return;
    }

    likeBtn.disabled = true;
    setMessage("Updating likes...");

    apiHit(LIKE_KEY)
      .then(function (data) {
        likeEl.textContent = typeof data.value === "number" ? String(data.value) : "--";
        likeBtn.textContent = "Liked";
        localStorage.setItem(LIKE_FLAG, "1");
        setMessage("Thanks for the like!");
      })
      .catch(function () {
        likeBtn.disabled = false;
        setMessage("Could not update likes. Please try again.");
      });
  });

  countVisitOncePerSession();
})();

