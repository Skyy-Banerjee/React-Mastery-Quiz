import { useReducer } from "react";

//! Simple app, using useReducer()

const initialState = { count: 0, step: 1 };

function reducerFx(state, action) {
  console.log(state, action);
  switch (action.type) {
    case 'dec':
      return { ...state, count: state.count - state.step };
    case 'inc':
      return { ...state, count: state.count + state.step };
    case 'setCount':
      return { ...state, count: action.payload };
    case 'setStep':
      return { ...state, step: action.payload };
    case 'reset':
      return initialState;
    default:
      throw new Error("Unknown Action!")
  }
}



function DateCounter() {
  const [state, dispatch] = useReducer(reducerFx, initialState);

  //destructuring helps a lot {}
  const { count, step } = state;


  const date = new Date;
  date.setDate(date.getDate() + count);

  function dec() {
    dispatch({ type: "dec" });
  }

  function inc() {
    dispatch({ type: "inc" });
  }

  function defineCount(e) {
    dispatch({ type: "setCount", payload: Number(e.target.value) });
  }

  function defineStep(e) {
    dispatch({ type: "setStep", payload: Number(e.target.value) });
  }

  function reset() {
    dispatch({ type: "reset" });
  }

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
