window.JunkFeedStorage = {
  key: "junkfeed-quiz-answers",

  getAnswers: function () {
    try {
      var raw = sessionStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  },

  saveAnswer: function (questionId, label, isCorrect) {
    var answers = this.getAnswers();
    answers[String(questionId)] = { label: label, correct: isCorrect };
    sessionStorage.setItem(this.key, JSON.stringify(answers));
  },

  getScore: function () {
    var answers = this.getAnswers();
    var correct = 0;
    Object.keys(answers).forEach(function (k) {
      if (answers[k].correct) correct++;
    });
    return correct;
  },

  reset: function () {
    sessionStorage.removeItem(this.key);
  },
};
