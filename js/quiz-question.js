(function () {
  var questionId = document.body.getAttribute("data-question");
  var nextPage = document.body.getAttribute("data-next");
  var grid = document.getElementById("quiz-answers");
  var nextBtn = document.getElementById("quiz-next");
  if (!questionId || !grid || !nextBtn) return;

  var buttons = grid.querySelectorAll(".quiz-answer-btn");
  var selectedBtn = null;

  function applyFeedback(btn) {
    var isCorrect = btn.getAttribute("data-correct") === "true";

    grid.classList.add("is-locked");

    buttons.forEach(function (b) {
      b.disabled = true;
      b.classList.remove("quiz-answer-btn--selected");
      b.classList.remove("quiz-answer-btn--correct");
      b.classList.remove("quiz-answer-btn--incorrect");
      b.setAttribute("aria-pressed", "false");

      if (b.getAttribute("data-correct") === "true") {
        b.classList.add("quiz-answer-btn--correct");
      } else if (b === btn && !isCorrect) {
        b.classList.add("quiz-answer-btn--incorrect");
      }
    });

    btn.setAttribute("aria-pressed", "true");
    nextBtn.hidden = false;

    if (window.JunkFeedMotion && JunkFeedMotion.quizFeedback) {
      JunkFeedMotion.quizFeedback(btn, isCorrect);
    }
  }

  buttons.forEach(function (btn) {
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", function () {
      if (grid.classList.contains("is-locked")) return;
      selectedBtn = btn;
      applyFeedback(btn);
    });
  });

  nextBtn.addEventListener("click", function () {
    if (!selectedBtn) return;

    var label = selectedBtn.getAttribute("data-label");
    var isCorrect = selectedBtn.getAttribute("data-correct") === "true";

    JunkFeedStorage.saveAnswer(questionId, label, isCorrect);

    if (window.JunkFeedMotion && JunkFeedMotion.quizNavigate) {
      JunkFeedMotion.quizNavigate(nextPage);
    } else {
      window.location.href = nextPage;
    }
  });
})();
