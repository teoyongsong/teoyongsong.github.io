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

