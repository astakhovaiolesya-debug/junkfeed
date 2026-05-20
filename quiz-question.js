(function () {
  var questionId = document.body.getAttribute("data-question");
  var nextPage = document.body.getAttribute("data-next");
  var grid = document.getElementById("quiz-answers");
  if (!questionId || !grid) return;

  var buttons = grid.querySelectorAll(".quiz-answer-btn");

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (grid.classList.contains("is-locked")) return;
      grid.classList.add("is-locked");

      var label = btn.getAttribute("data-label");
      var isCorrect = btn.getAttribute("data-correct") === "true";

      buttons.forEach(function (b) {
        b.disabled = true;
        if (b === btn) b.classList.add("quiz-answer-btn--selected");
        if (b.getAttribute("data-correct") === "true") {
          b.classList.add("quiz-answer-btn--correct");
        } else if (b === btn && !isCorrect) {
          b.classList.add("quiz-answer-btn--incorrect");
        }
      });

      JunkFeedStorage.saveAnswer(questionId, label, isCorrect);

      setTimeout(function () {
        window.location.href = nextPage;
      }, 900);
    });
  });
})();
