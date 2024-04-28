import { useEffect, useReducer } from 'react';

import Header from './components/Header';
import MainComp from './components/MainComp';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NxtBtn from './components/NxtBtn';
import Progress from './components/Progress';
import FinishedScreen from './components/FinishedScreen';
import Footer from './components/Footer';
import QuizTimer from './components/QuizTimer';

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

//! Reducer fx{}
function reducerFx(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case 'dataFailed':
      return {
        ...state,
        status: "error",
      }
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION
      }
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      }
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      }
    case 'finished':
      return {
        ...state,
        status: "finished",
        highscore: state.points > state.highscore ? state.points : state.highscore,
      }
    case 'restart':
      return {
        ...state,
        status: 'ready',
        index: 0,
        answer: null,
        points: 0,
        highscore: 0,
      }
    //! or...
    // case 'restart':
    //   return {
    //    ...initialState,
    //    questions: state.questions,
    //    status: 'ready',
    //   }

    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      }

    default:
      throw new Error("Action Unknown!");
  }
}

function App() {

  const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(reducerFx, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, curr) => prev + curr.points, 0)

  useEffect(() => {
    fetch('http://localhost:6173/questions')
      .then((resp) => resp.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, [])

  return (
    <div className='app'>
      <Header />

      <MainComp>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (<StartScreen numQuestions={numQuestions} dispatch={dispatch} />)}
        {status === 'active' && (<>
          <Progress index={index}
            numQuestions={numQuestions}
            points={points} maxPossiblePoints={maxPossiblePoints}
            answer={answer}
          />
          <Question question={questions[index]} dispatch={dispatch} answer={answer} />
          <Footer>
            <QuizTimer dispatch={dispatch} secondsRemaining={secondsRemaining
            } />
            <NxtBtn dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
          </Footer>
        </>)}
        {status === 'finished' && <FinishedScreen maxPossiblePoints={maxPossiblePoints}
          points={points} highscore={highscore} dispatch={dispatch} />}
      </MainComp>
    </div>
  )
}

export default App
