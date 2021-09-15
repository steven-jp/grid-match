const initialScore = { correct: 0, incorrect: 0 };
export const scoreReducer = (state, action) => {
  switch (action.type) {
    case "CORRECT":
      return { ...state, correct: state.correct + 1 };
    case "INCORRECT":
      return { ...state, incorrect: state.incorrect + 1 };
    case "RESET":
      return initialScore;

    default:
      return;
  }
};
