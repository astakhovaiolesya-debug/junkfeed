/**
 * Junk Feed — playful motion system (truus.co inspired)
 */
(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

  function rafThrottle(fn) {
    var ticking = false;
    return function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        fn();
        ticking = false;
      });
    };
  }

  /* ── Magnetic hover ───────────────────────────── */
  function initMagnetic() {
    var strength = 0.3;

    document.querySelectorAll("[data-motion='magnetic']").forEach(function (el) {
      el.classList.add("motion-magnetic");
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform =
          "translate(" + x * strength + "px, " + y * strength + "px) translateZ(0)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate(0, 0) translateZ(0)";
      });
    });

    document.querySelectorAll(".btn, [data-motion='magnetic-btn']").forEach(function (el) {
      if (el.closest(".quiz-answer-btn")) return;
      el.classList.add("motion-magnetic-btn");
    });

  }

  /* ── Stickers ─────────────────────────────────── */
  function initStickers() {
    var stickers = document.querySelectorAll(
      ".technique-sticker, .hero-block__sticker, [data-motion='sticker']"
    );

    stickers.forEach(function (sticker) {
      sticker.classList.add("motion-sticker");

      sticker.addEventListener("mousedown", function () {
        sticker.classList.add("is-pressed");
      });
      sticker.addEventListener("animationend", function (e) {
        if (e.animationName === "motion-sticker-squish") {
          sticker.classList.remove("is-pressed");
        }
      });
    });

    if (prefersReduced || stickers.length === 0) return;

    var nearRadius = 50;

    document.addEventListener(
      "mousemove",
      rafThrottle(function (e) {
        stickers.forEach(function (sticker) {
          if (sticker.closest(".technique-badge")) return;
          var rect = sticker.getBoundingClientRect();
          var cx = rect.left + rect.width / 2;
          var cy = rect.top + rect.height / 2;
          var dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          var pull = Math.max(0, 1 - dist / (nearRadius * 3));
          if (sticker.classList.contains("is-sticker-active")) return;

          if (dist < nearRadius * 2) {
            sticker.classList.add("is-near");
            var dx = (e.clientX - cx) * 0.08 * pull;
            var dy = (e.clientY - cy) * 0.08 * pull;
            if (!sticker.matches(":hover")) {
              sticker.style.transform =
                "translate(" + dx + "px, " + dy + "px) translateZ(0)";
            }
          } else {
            sticker.classList.remove("is-near");
            if (!sticker.matches(":hover")) sticker.style.transform = "";
          }
        });
      }),
      { passive: true }
    );
  }

  function getStickerBaseRotate(sticker) {
    if (
      sticker.classList.contains("technique-sticker--main-red") ||
      sticker.classList.contains("technique-sticker--learn-red")
    ) {
      return 12.02;
    }
    if (
      sticker.classList.contains("technique-sticker--main-emotional") ||
      sticker.classList.contains("technique-sticker--learn-emotional")
    ) {
      return -12.22;
    }
    if (
      sticker.classList.contains("technique-sticker--main-cherry") ||
      sticker.classList.contains("technique-sticker--learn-cherry")
    ) {
      return 19.36;
    }
    if (sticker.classList.contains("technique-sticker--learn-misrep")) {
      return 12.83;
    }
    if (sticker.classList.contains("technique-sticker--learn-slippery")) {
      return -17.9;
    }
    return 0;
  }

  /* ── Technique card hover (lift + tilt + sticker) ─ */
  function initTechniqueCardHover() {
    document.querySelectorAll(".technique-card:not(.technique-card--home)").forEach(function (card) {
      card.classList.add("motion-card-hover");
    });

    if (prefersReduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.querySelectorAll(".techniques__row").forEach(function (row) {
      var cards = row.querySelectorAll(".technique-card");
      var stickers = row.querySelectorAll(".technique-sticker");

      cards.forEach(function (card, i) {
        var sticker = stickers[i] || null;
        var stickerBaseRot = sticker ? getStickerBaseRotate(sticker) : 0;

        function setStickerActive(active) {
          if (!sticker || !sticker.classList.contains("is-visible")) return;
          if (active) {
            sticker.classList.add("is-sticker-active");
            sticker.style.transform =
              "rotate(" +
              (stickerBaseRot + 8) +
              "deg) scale(1.1) translateZ(0)";
          } else {
            sticker.classList.remove("is-sticker-active");
            sticker.style.transform = "";
          }
        }

        function applyCardHoverTransform(rotateX, rotateY) {
          card.style.transform =
            "perspective(1000px) rotateX(" +
            rotateX +
            "deg) rotateY(" +
            rotateY +
            "deg) translateY(-10px) scale(1.05) translateZ(0)";
        }

        card.addEventListener("mouseenter", function () {
          if (!card.classList.contains("is-visible")) return;
          card.classList.add("is-hovered");
          applyCardHoverTransform(0, 0);
          setStickerActive(true);
        });

        card.addEventListener("mousemove", function (e) {
          if (!card.classList.contains("is-visible")) return;
          var rect = card.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;
          applyCardHoverTransform(-y * 8, x * 8);
        });

        card.addEventListener("mouseleave", function () {
          card.classList.remove("is-hovered");
          card.style.transform = "";
          setStickerActive(false);
        });
      });
    });
  }

  /* ── Scroll reveals ───────────────────────────── */
  function initScrollReveal() {
    var sections = document.querySelectorAll(
      ".section, .techniques__title, .cta-card, .faq__title, .quiz-screen__intro"
    );

    sections.forEach(function (el) {
      el.classList.add("motion-reveal");
    });

    var staggerContainers = document.querySelectorAll(".faq__grid, .quiz-answers");
    staggerContainers.forEach(function (el) {
      el.classList.add("motion-reveal", "motion-reveal--stagger");
    });

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".motion-reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          if (entry.target.classList.contains("motion-reveal--stagger")) {
            Array.prototype.forEach.call(entry.target.children, function (child, i) {
              child.style.transitionDelay = i * 0.08 + "s";
            });
          }
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    document.querySelectorAll(".motion-reveal").forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Technique card scroll reveal ─────────────── */
  function initTechniqueCardReveal() {
    var rows = document.querySelectorAll(".techniques__row");
    if (!rows.length) return;

    var staggerStep = 150;
    var homeStaggerStep = 200;
    var homeCardIndex = 0;

    rows.forEach(function (row) {
      var cards = row.querySelectorAll(".technique-card");
      var stickers = row.querySelectorAll(".technique-sticker");

      cards.forEach(function (card, i) {
        card.classList.add("motion-card-reveal");
        if (card.classList.contains("technique-card--home")) {
          card.style.setProperty("--reveal-delay", homeCardIndex * homeStaggerStep + "ms");
          homeCardIndex += 1;
        } else {
          card.style.setProperty("--reveal-delay", i * staggerStep + "ms");
        }
      });

      stickers.forEach(function (sticker, i) {
        sticker.classList.add("motion-sticker-reveal");
        sticker.style.setProperty("--reveal-delay", i * staggerStep + 300 + "ms");
      });
    });

    if (prefersReduced || !("IntersectionObserver" in window)) {
      document
        .querySelectorAll(".motion-card-reveal, .motion-sticker-reveal")
        .forEach(function (el) {
          el.classList.add("is-visible");
        });
      return;
    }

    var rowObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target
            .querySelectorAll(".motion-card-reveal, .motion-sticker-reveal")
            .forEach(function (el) {
              el.classList.add("is-visible");
            });
          rowObserver.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -100px 0px", threshold: 0.1 }
    );

    rows.forEach(function (row) {
      rowObserver.observe(row);
    });
  }

  /* ── Parallax on scroll ───────────────────────── */
  function initParallax() {
    var grid = document.querySelector(".hero-block__grid");
    var stickers = document.querySelectorAll(".technique-sticker.motion-sticker");

    if (grid) grid.classList.add("motion-parallax");

    if (prefersReduced) return;

    var onScroll = rafThrottle(function () {
      var scrollY = window.scrollY;
      if (grid) {
        grid.style.transform = "translateY(" + scrollY * 0.12 + "px) translateZ(0)";
      }
      stickers.forEach(function (el, i) {
        if (el.closest(".technique-badge")) return;
        if (
          el.matches(":hover") ||
          el.classList.contains("is-near") ||
          el.classList.contains("is-sticker-active")
        ) {
          return;
        }
        var rot = scrollY * 0.015 * (i % 2 === 0 ? 1 : -1);
        el.style.transform = "rotate(" + rot + "deg) translateZ(0)";
      });
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Confetti ─────────────────────────────────── */
  function burstConfetti(originX, originY) {
    if (prefersReduced) return;

    var layer = document.createElement("div");
    layer.className = "motion-confetti";
    var colors = ["#eb4424", "#facb2c", "#d7e041", "#619ad2", "#f2efe7"];

    for (var i = 0; i < 36; i++) {
      var piece = document.createElement("span");
      piece.className = "motion-confetti__piece";
      piece.style.left = originX + "px";
      piece.style.top = originY + "px";
      piece.style.background = colors[i % colors.length];
      var dx = (Math.random() - 0.5) * 280;
      var dy = 80 + Math.random() * 220;
      piece.style.setProperty("--dx", dx + "px");
      piece.style.setProperty("--dy", dy + "px");
      piece.style.animationDelay = Math.random() * 0.15 + "s";
      layer.appendChild(piece);
    }

    document.body.appendChild(layer);
    setTimeout(function () {
      layer.remove();
    }, 1400);
  }

  /* ── Quiz progress bar (question-based, not scroll) ─ */
  function updateQuizProgress(currentQuestion, totalQuestions) {
    var bar = document.querySelector(".quiz-progress-bar");
    if (!bar || !totalQuestions) return;

    var pct = (currentQuestion / totalQuestions) * 100;
    bar.style.width = pct + "%";

    var container = bar.closest(".quiz-progress-bar-container");
    if (container) {
      container.setAttribute("aria-valuenow", String(Math.round(pct)));
      container.setAttribute(
        "aria-label",
        "Quiz progress " + Math.round(pct) + " percent"
      );
    }
  }

  function initQuizPageProgress() {
    if (!document.body.classList.contains("page-quiz")) return;

    var container = document.querySelector(".quiz-progress-bar-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "quiz-progress-bar-container";
      container.setAttribute("role", "progressbar");
      container.setAttribute("aria-valuemin", "0");
      container.setAttribute("aria-valuemax", "100");
      container.innerHTML = '<span class="quiz-progress-bar"></span>';
      document.body.insertBefore(container, document.body.firstChild);
    }

    var total = window.JunkFeedQuiz ? JunkFeedQuiz.total : 5;
    var current = 0;
    var q = document.body.getAttribute("data-question");

    if (q) {
      current = parseInt(q, 10);
    } else if (document.getElementById("results-score")) {
      current = total;
    }

    requestAnimationFrame(function () {
      updateQuizProgress(current, total);
    });
  }

  function initQuizEnter() {
    var screen = document.querySelector(".quiz-screen:not(.quiz-screen--landing)");
    if (!screen) return;
    screen.classList.add("motion-quiz-enter");
  }

  function quizFeedback(btn, isCorrect) {
    var grid = document.getElementById("quiz-answers");
    if (!grid) return;

    grid.classList.add("is-animating");
    btn.classList.add("motion-answer-pop");

    if (isCorrect) {
      btn.classList.add("motion-success-bounce");
      var rect = btn.getBoundingClientRect();
      burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
      btn.classList.add("motion-shake");
    }

    setTimeout(function () {
      grid.classList.remove("is-animating");
    }, 550);
  }

  function quizNavigate(url) {
    var screen = document.querySelector(".quiz-screen");
    if (!screen || prefersReduced) {
      window.location.href = url;
      return;
    }
    screen.classList.add("motion-quiz-exit");
    document.body.classList.add("is-quiz-animating");
    setTimeout(function () {
      window.location.href = url;
    }, 380);
  }

  function initResults() {
    var copy = document.querySelector(".results-copy");
    if (copy) copy.classList.add("motion-results-enter");

    var el = document.getElementById("results-score");
    if (!el || prefersReduced) return;

    var text = el.textContent;
    var match = text.match(/(\d+)/);
    if (!match) return;

    var target = parseInt(match[1], 10);
    var start = 0;
    var duration = 1200;
    var startTime = null;

    el.textContent = text.replace(String(target), "0");

    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(start + (target - start) * eased);
      el.textContent = text.replace(/\d+/, String(val));
      if (p < 1) requestAnimationFrame(step);
      else burstConfetti(window.innerWidth / 2, window.innerHeight / 3);
    }

    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(step);
          obs.disconnect();
        }
      });
      obs.observe(el);
    } else {
      requestAnimationFrame(step);
    }
  }

  /* ── Boot ─────────────────────────────────────── */
  function init() {
    initQuizPageProgress();

    if (prefersReduced) {
      document.documentElement.classList.add("reduce-motion");
      document.querySelectorAll(".motion-reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
      initTechniqueCardReveal();
      initTechniqueCardHover();
      return;
    }

    initMagnetic();
    initStickers();
    initScrollReveal();
    initTechniqueCardReveal();
    initTechniqueCardHover();
    initParallax();
    initQuizEnter();
  }

  window.JunkFeedMotion = {
    prefersReduced: prefersReduced,
    quizFeedback: quizFeedback,
    quizNavigate: quizNavigate,
    burstConfetti: burstConfetti,
    initResults: initResults,
    updateQuizProgress: updateQuizProgress,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
