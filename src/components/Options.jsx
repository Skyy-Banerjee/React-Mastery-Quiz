import React from 'react'

function Options({ question, dispatch, answer }) {
    const hasAnswered = answer !== null;
    return (
        <div className="options">
            {question.options.map((option, idx) => {
                return <button className={`btn btn-option ${idx === answer ? 'answer' : ''} 
                ${hasAnswered ? idx === question.correctOption ? 'correct' : 'wrong' : ''}`}
                    onClick={() => dispatch({ type: 'newAnswer', payload: idx })}
                    key={option} disabled={hasAnswered} >
                    {option}
                </button>
            })}
        </div>
    )
}

export default Options;
