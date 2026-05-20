/* Quiz content from Figma frames 57:1101, 58:1344, 58:1385, 58:1427, 58:1468 */
window.JunkFeedQuiz = {
  total: 5,
  questions: [
    {
      id: 1,
      page: "question1.html",
      next: "question2.html",
      progress: "1/5",
      prompt: "What type of disinformation is this?",
      quote:
        "“According to one small study, social media has no negative effects. Therefore, there is no problem with online misinformation.”",
      quoteHtml: false,
      answers: [
        { label: "Red Herring", correct: false },
        { label: "Emotional Language", correct: false },
        { label: "Cherry Picking", correct: true },
        { label: "Slippery Slope", correct: false },
      ],
    },
    {
      id: 2,
      page: "question2.html",
      next: "question3.html",
      progress: "2/5",
      prompt: "What type of disinformation is this?",
      quoteHtml: true,
      quote:
        "Person A: “We need to talk about misinformation online.”<br />Person B: “But what about how traditional media also makes mistakes?”",
      answers: [
        { label: "Red Herring", correct: true },
        { label: "Emotional Language", correct: false },
        { label: "Cherry Picking", correct: false },
        { label: "Slippery Slope", correct: false },
      ],
    },
    {
      id: 3,
      page: "question3.html",
      next: "question4.html",
      progress: "3/5",
      prompt: "What type of disinformation is this?",
      quote:
        "“BREAKING: This shocking secret will change everything you believe!”",
      quoteHtml: false,
      answers: [
        { label: "Emotional Language", correct: true },
        { label: "Red Herring", correct: false },
        { label: "Cherry Picking", correct: false },
        { label: "Misrepresentation", correct: false },
      ],
    },
    {
      id: 4,
      page: "question4.html",
      next: "question5.html",
      progress: "4/5",
      prompt: "What type of disinformation is this?",
      quote:
        "“The report says online engagement increased this year, but the post claims it proves social media is completely destroying society.”",
      quoteHtml: false,
      answers: [
        { label: "Emotional Language", correct: false },
        { label: "Red Herring", correct: false },
        { label: "Misrepresentation", correct: true },
        { label: "Slippery Slope", correct: false },
      ],
    },
    {
      id: 5,
      page: "question5.html",
      next: "results.html",
      progress: "5/5",
      prompt: "What type of disinformation is this?",
      quote:
        "“If we allow one unverified post, soon all news will become fake, and society will collapse.”",
      quoteHtml: false,
      answers: [
        { label: "Emotional Language", correct: false },
        { label: "Misrepresentation", correct: false },
        { label: "Cherry Picking", correct: false },
        { label: "Slippery Slope", correct: true },
      ],
    },
  ],
};
