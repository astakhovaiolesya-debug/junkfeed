(function () {
  var score = JunkFeedStorage.getScore();
  var total = window.JunkFeedQuiz ? JunkFeedQuiz.total : 5;
  var el = document.getElementById("results-score");
  if (el) {
    el.textContent = "You answered " + score + " out of " + total + " correctly.";
    el.setAttribute("data-score-target", String(score));
  }

  if (window.JunkFeedMotion && JunkFeedMotion.initResults) {
    JunkFeedMotion.initResults();
  }
})();
