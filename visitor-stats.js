(function () {
  "use strict";

  var API_BASE = "https://api.counterapi.dev/v1";
  var NAMESPACE = "teoyongsong-github-io";
  var OVERALL_VISITOR_COUNTER = "site-visitors";
  var OVERALL_LIKE_COUNTER = "site-likes";

  var PAGE_KEY = getPageKey();
  var PAGE_VISITOR_COUNTER = "page-" + PAGE_KEY + "-visitors";
  var PAGE_LIKE_COUNTER = "page-" + PAGE_KEY + "-likes";
  var LIKE_FLAG = "liked-teoyongsong-site-" + PAGE_KEY;
  var VISIT_FLAG = "counted-teoyongsong-visit-" + PAGE_KEY;

  var overallVisitorEl = document.getElementById("overall-visitor-count");
  var overallLikeEl = document.getElementById("overall-like-count");
  var pageVisitorEl = document.getElementById("page-visitor-count");
  var pageLikeEl = document.getElementById("page-like-count");
  var likeBtn = document.getElementById("like-btn");
  var msgEl = document.getElementById("engagement-message");

  if (!overallVisitorEl || !overallLikeEl || !pageVisitorEl || !pageLikeEl || !likeBtn || !msgEl) return;

  function setMessage(text) {
    msgEl.textContent = text || "";
  }

  function getPageKey() {
    var path = (window.location.pathname || "/").toLowerCase();
    if (path === "/" || path === "/index.html") return "home";
    return path.replace(/^\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function getUrl(name, action) {
    if (action) return API_BASE + "/" + NAMESPACE + "/" + name + "/" + action;
    return API_BASE + "/" + NAMESPACE + "/" + name + "/";
  }

  function requestJSON(url) {
    return fetch(url, { cache: "no-store", mode: "cors" }).then(function (res) {
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
    getCount(OVERALL_VISITOR_COUNTER)
      .then(function (count) {
        overallVisitorEl.textContent = String(count);
      })
      .catch(function () {
        overallVisitorEl.textContent = "--";
        setMessage("Unable to load overall visitor count right now.");
      });

    getCount(OVERALL_LIKE_COUNTER)
      .then(function (count) {
        overallLikeEl.textContent = String(count);
      })
      .catch(function () {
        overallLikeEl.textContent = "--";
      });

    getCount(PAGE_VISITOR_COUNTER)
      .then(function (count) {
        pageVisitorEl.textContent = String(count);
      })
      .catch(function () {
        pageVisitorEl.textContent = "--";
      });

    getCount(PAGE_LIKE_COUNTER)
      .then(function (count) {
        pageLikeEl.textContent = String(count);
      })
      .catch(function () {
        pageLikeEl.textContent = "--";
        if (!msgEl.textContent) setMessage("Unable to load page like count right now.");
      });
  }

  function countVisitOncePerSession() {
    if (sessionStorage.getItem(VISIT_FLAG) === "1") {
      refreshCounts();
      return;
    }

    Promise.all([increment(OVERALL_VISITOR_COUNTER), increment(PAGE_VISITOR_COUNTER)])
      .then(function (counts) {
        overallVisitorEl.textContent = String(counts[0]);
        pageVisitorEl.textContent = String(counts[1]);
        sessionStorage.setItem(VISIT_FLAG, "1");
        return Promise.all([getCount(OVERALL_LIKE_COUNTER), getCount(PAGE_LIKE_COUNTER)]);
      })
      .then(function (counts) {
        overallLikeEl.textContent = String(counts[0]);
        pageLikeEl.textContent = String(counts[1]);
      })
      .catch(function () {
        refreshCounts();
      });
  }

  if (localStorage.getItem(LIKE_FLAG) === "1") {
    likeBtn.disabled = true;
    likeBtn.textContent = "Liked";
    setMessage("Thanks! You already liked this page on this device.");
  }

  likeBtn.addEventListener("click", function () {
    if (localStorage.getItem(LIKE_FLAG) === "1") return;

    likeBtn.disabled = true;
    setMessage("Updating likes...");

    Promise.all([increment(OVERALL_LIKE_COUNTER), increment(PAGE_LIKE_COUNTER)])
      .then(function (counts) {
        overallLikeEl.textContent = String(counts[0]);
        pageLikeEl.textContent = String(counts[1]);
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


