/**
 * Portfolio site chat: optional LLM (via Worker proxy) + offline keyword fallback.
 * Configure API URL: <meta name="site-chat-api" content="https://your-worker.workers.dev">
 * Optional model: <meta name="site-chat-model" content="gpt-4o-mini">
 * Or window.__SITE_CHAT_API__ / window.__SITE_CHAT_MODEL__
 */
(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getMeta(name) {
    var el = document.querySelector('meta[name="' + name + '"]');
    return el && el.getAttribute("content") ? el.getAttribute("content").trim() : "";
  }

  function getApiUrl() {
    if (typeof window.__SITE_CHAT_API__ === "string" && window.__SITE_CHAT_API__) {
      return window.__SITE_CHAT_API__.trim();
    }
    return getMeta("site-chat-api");
  }

  function getModel() {
    if (typeof window.__SITE_CHAT_MODEL__ === "string" && window.__SITE_CHAT_MODEL__) {
      return window.__SITE_CHAT_MODEL__.trim();
    }
    return getMeta("site-chat-model") || "";
  }

  var SYSTEM_PROMPT =
    "You are the official assistant for Danny Teo Yong Song's portfolio website (teoyongsong.github.io), hosted on GitHub Pages.\n\n" +
    "RULES:\n" +
    "1) Only answer questions about this website, Danny's work described below, his projects, blog, capabilities, how to contact or collaborate, and the companion consulting site dannyteo.github.io when relevant for consulting/speaking.\n" +
    "2) If the user asks anything else (general knowledge, coding homework unrelated to the site, other people, news, etc.), politely refuse and remind them you only cover this portfolio site.\n" +
    "3) Be concise and friendly. Use short paragraphs or bullet lists when helpful.\n" +
    "4) Do not invent links or projects that are not listed below. If unsure, say you are not sure and point to the Contact section on the site.\n\n" +
    "SITE FACTS (ground truth):\n" +
    "- Danny Teo Yong Song: consultant, builder; AI, data, security, product storytelling; 3-day sprints to working prototypes.\n" +
    "- Featured projects: RAG Studio (private-by-default local RAG), HDB resale price predictor (Singapore public data), CNN waste classification (Streamlit), Once Upon App (family storytelling MVP). More projects under Other apps.\n" +
    "- Blog: e.g. How I Built My Personal Website with GitHub Pages; ML fundamentals; data to business impact. Index at blog.html.\n" +
    "- Contact: WhatsApp +65 9685 2990, email teo_yongsong@yahoo.com.sg, GitHub teoyongsong, LinkedIn /in/teoyongsong. Formal consulting: dannyteo.github.io.\n" +
    "- Stack: static HTML/CSS/vanilla JS on GitHub Pages; visitor-stats.js for QR vCard tap.";

  var knowledgeBase = {
    about:
      "I'm the Portfolio AI Assistant for Danny Teo Yong Song (teoyongsong.github.io). Danny is a consultant and builder who specializes in turning ideas into working prototypes in **3-day sprints**. His focus areas are AI/ML, data, security, and product storytelling — expressed as live apps and honest write-ups.",
    projects:
      "Danny's flagship projects include:\n• **RAG Studio** — Private-by-default local RAG (no data leaves your machine)\n• **HDB Resale Price Predictor** — ML model trained on Singapore public data\n• **CNN Waste Classification** — Computer vision model for recycling\n• **Once Upon App** — Personalized family storytelling MVP\n\nAll have live demos. Check the 'Featured Projects' section.",
    blog:
      "The latest post is 'How I Built My Personal Website with GitHub Pages' (April 2026). Other articles cover machine learning fundamentals and 'From Data to Business Impact'. The blog shows practical implementation, not just theory. See the Latest Insight card or blog.html.",
    contact:
      "You can reach Danny via:\n• WhatsApp: +65 9685 2990\n• Email: teo_yongsong@yahoo.com.sg\n• GitHub: github.com/teoyongsong\n• LinkedIn: linkedin.com/in/teoyongsong\n\nFor consulting, workshops or speaking engagements, visit https://dannyteo.github.io/",
    sprint:
      "Danny helps teams validate ideas quickly with **3-day sprints** — building a working prototype you can test with users immediately. This approach reduces risk and accelerates learning. See the 'Work together' section for details.",
    capabilities:
      "From the radar chart on the homepage: AI/ML (very strong), Data, Security, Consulting, Storytelling, and Engineering. The emphasis is on **building real things** rather than slide decks.",
    default:
      "This site is Danny Teo Yong Song's portfolio showcasing his AI/ML projects, data work, blog, and consulting approach. What specific part would you like to explore?",
    offtopic:
      "I'm sorry, but I can **only** answer questions about this website (teoyongsong.github.io), Danny's projects, blog posts, capabilities, or how to work with him.\n\nCould you please ask something related to the content here?",
  };

  var suggestedPrompts = [
    "What are Danny's main projects?",
    // "Tell me about the RAG Studio",
    // "How can I work with Danny?",
    // "What is the latest blog post about?",
    // "Tell me about his 3-day sprints",
  ];

  function getResponse(userMessage) {
    var lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes("who") || lowerMsg.includes("about you") || lowerMsg.includes("yourself")) {
      return knowledgeBase.about;
    }
    if (
      lowerMsg.includes("project") ||
      lowerMsg.includes("rag") ||
      lowerMsg.includes("hdb") ||
      lowerMsg.includes("cnn") ||
      lowerMsg.includes("waste") ||
      lowerMsg.includes("once upon")
    ) {
      return knowledgeBase.projects;
    }
    if (lowerMsg.includes("blog") || lowerMsg.includes("insight") || lowerMsg.includes("post") || lowerMsg.includes("article")) {
      return knowledgeBase.blog;
    }
    if (
      lowerMsg.includes("contact") ||
      lowerMsg.includes("email") ||
      lowerMsg.includes("whatsapp") ||
      lowerMsg.includes("work with") ||
      lowerMsg.includes("consult")
    ) {
      return knowledgeBase.contact;
    }
    if (lowerMsg.includes("sprint") || lowerMsg.includes("3 day") || lowerMsg.includes("3-day") || lowerMsg.includes("prototype")) {
      return knowledgeBase.sprint;
    }
    if (lowerMsg.includes("capability") || lowerMsg.includes("radar") || lowerMsg.includes("skill") || lowerMsg.includes("good at")) {
      return knowledgeBase.capabilities;
    }
    var siteTerms = ["danny", "teo", "portfolio", "github", "project", "blog", "ai", "ml", "data", "sprint", "rag", "consult", "contact"];
    var isRelated = siteTerms.some(function (term) {
      return lowerMsg.includes(term);
    });
    if (isRelated) return knowledgeBase.default;
    return knowledgeBase.offtopic;
  }

  function formatRuleBasedHtml(text) {
    return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  }

  function formatPlainHtml(text) {
    return escapeHtml(text).replace(/\n/g, "<br>");
  }

  function init() {
    var chatToggle = document.getElementById("chat-toggle");
    var chatWindow = document.getElementById("chat-window");
    var chatMessages = document.getElementById("chat-messages");
    var chatInput = document.getElementById("chat-input");
    var chatSend = document.getElementById("chat-send");
    var chatClose = document.getElementById("chat-close");
    var suggestedContainer = document.getElementById("suggested-prompts");
    if (!chatToggle || !chatWindow || !chatMessages || !chatInput || !chatSend || !chatClose) return;

    var isOpen = false;
    var apiUrl = getApiUrl();
    var model = getModel();
    var thread = [];

    function addMessage(text, isUser, format) {
      format = format || "plain";
      var messageDiv = document.createElement("div");
      messageDiv.className = "message " + (isUser ? "user" : "bot");
      if (isUser) {
        messageDiv.innerHTML = formatPlainHtml(text);
      } else if (format === "rules") {
        messageDiv.innerHTML = formatRuleBasedHtml(text);
      } else {
        messageDiv.innerHTML = formatPlainHtml(text);
      }
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
      var typingDiv = document.createElement("div");
      typingDiv.className = "typing-indicator";
      typingDiv.id = "typing-indicator";
      typingDiv.innerHTML =
        '<div class="typing-dots">' +
        '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>' +
        "</div>" +
        '<span style="font-size:0.82em; color:#64748b; margin-left:8px;">thinking...</span>';
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
      var typing = document.getElementById("typing-indicator");
      if (typing) typing.remove();
    }

    function fetchLLM(url, messages) {
      var body = { messages: messages };
      if (model) body.model = model;
      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error((data && data.error) || res.statusText || "Request failed");
          if (!data || typeof data.content !== "string") throw new Error("Empty reply");
          return data.content;
        });
      });
    }

    function renderSuggestedPrompts() {
      if (!suggestedContainer) return;
      suggestedContainer.innerHTML = "";
      suggestedPrompts.forEach(function (prompt) {
        if (!prompt || String(prompt).trim().indexOf("//") === 0) return;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "suggested-prompt";
        btn.textContent = prompt;
        btn.addEventListener("click", function () {
          handleUserInput(prompt);
        });
        suggestedContainer.appendChild(btn);
      });
    }

    function handleUserInput(message) {
      if (!message) return;

      addMessage(message, true);
      chatInput.value = "";
      showTypingIndicator();

      if (apiUrl) {
        thread.push({ role: "user", content: message });
        var msgs = [{ role: "system", content: SYSTEM_PROMPT }].concat(thread);
        fetchLLM(apiUrl, msgs)
          .then(function (reply) {
            removeTypingIndicator();
            thread.push({ role: "assistant", content: reply });
            addMessage(reply, false, "plain");
          })
          .catch(function (err) {
            thread.pop();
            removeTypingIndicator();
            addMessage(
              "I could not reach the AI service (" +
                escapeHtml(err.message || "error") +
                "). Here is an offline answer:\n\n" +
                getResponse(message),
              false,
              "rules"
            );
          });
        return;
      }

      setTimeout(function () {
        removeTypingIndicator();
        addMessage(getResponse(message), false, "rules");
      }, 450 + Math.random() * 350);
    }

    function toggleChat() {
      isOpen = !isOpen;
      if (isOpen) {
        chatWindow.classList.remove("hidden");
        chatToggle.style.display = "none";
        if (chatMessages.children.length === 0) {
          setTimeout(function () {
            addMessage(
              "Hi! I'm Danny's Portfolio assistant.\n\n" +
                (apiUrl
                  ? "I'm powered by an AI model for this site. I only answer questions **about this website** — projects, blog, sprints, capabilities, and how to collaborate."
                  : "I'm running in **offline** mode (no AI API configured). I only answer questions about this site using built-in help — add a `site-chat-api` meta tag to enable full AI (see repo `workers/site-chat-proxy/README.md`).") +
                "\n\nWhat would you like to know?",
              false,
              "rules"
            );
            renderSuggestedPrompts();
          }, 200);
        }
        chatInput.focus();
      } else {
        chatWindow.classList.add("hidden");
        setTimeout(function () {
          chatToggle.style.display = "flex";
        }, 280);
      }
    }

    chatToggle.addEventListener("click", toggleChat);
    chatClose.addEventListener("click", toggleChat);
    chatSend.addEventListener("click", function () {
      handleUserInput(chatInput.value.trim());
    });
    chatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleUserInput(chatInput.value.trim());
      }
    });
    document.addEventListener("click", function (e) {
      if (isOpen && !chatWindow.contains(e.target) && e.target !== chatToggle) {
        toggleChat();
      }
    });
    chatToggle.setAttribute("tabindex", "0");
    chatToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleChat();
      }
    });

    if (apiUrl) {
      console.log("%cSite chat: LLM mode", "color:#15803d;font-weight:700;", apiUrl);
    } else {
      console.log("%cSite chat: offline keyword mode (set meta site-chat-api for LLM)", "color:#b45309;font-weight:700;");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
