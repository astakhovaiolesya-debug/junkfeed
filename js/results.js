(function () {
  function bindOrphans(text) {
    var parts = text.trim().split(/\s+/);
    if (parts.length < 2) return text;
    var last = parts.pop();
    var prev = parts.pop();
    return (parts.length ? parts.join(" ") + " " : "") + prev + "\u00a0" + last;
  }

  function getResultTitle(score) {
    var titles = {
      5: "You're a disinformation detective!",
      4: "You know how manipulation works!",
      3: "You're getting the hang of it!",
      2: "Keep learning, you're on your way!",
      1: "Every expert started here!",
      0: "Let's learn together!",
    };
    return titles[score] !== undefined ? titles[score] : titles[0];
  }

  function showResults(correctAnswers, totalQuestions) {
    var titleEl = document.querySelector(".result-title");
    var scoreEl = document.getElementById("results-score");

    if (titleEl) {
      titleEl.textContent = bindOrphans(getResultTitle(correctAnswers));
    }
    if (scoreEl) {
      scoreEl.textContent =
        "You answered " +
        correctAnswers +
        " out\u00a0of " +
        totalQuestions +
        " correctly.";
      scoreEl.setAttribute("data-score-target", String(correctAnswers));
      scoreEl.setAttribute("data-score-total", String(totalQuestions));
    }
  }

  function initResultsMotion() {
    if (window.JunkFeedMotion && JunkFeedMotion.initResults) {
      JunkFeedMotion.initResults();
    }
  }

  var score = JunkFeedStorage.getScore();
  var total = window.JunkFeedQuiz ? JunkFeedQuiz.total : 5;
  showResults(score, total);

  /* motion.js is deferred — run after it loads, or on DOMContentLoaded */
  if (window.JunkFeedMotion && JunkFeedMotion.initResults) {
    initResultsMotion();
  } else {
    document.addEventListener("DOMContentLoaded", initResultsMotion);
  }
})();
