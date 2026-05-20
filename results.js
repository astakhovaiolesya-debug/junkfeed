(function () {
  var score = JunkFeedStorage.getScore();
  var total = JunkFeedQuiz ? JunkFeedQuiz.total : 5;
  var el = document.getElementById("results-score");
  if (el) {
    el.textContent = "You answered " + score + " out of " + total + " correctly.";
  }
})();
