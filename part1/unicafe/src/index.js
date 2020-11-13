import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Feedback = (name, [get, set]) => (
  {
    name: name,
    get: get,
    set: set
  }
)

const Button = ({text, value, setter}) => {
  const handler = () => {
    setter(value + 1)
  }
  return (
    <>
      <button onClick={handler}>{text}</button>
    </>
  )
}


const Buttons = ({feedback}) => (
  <div>
    <h1>give feedback</h1>
    {
      feedback.map(({name, get, set}, i) => (
        <Button text={name} value={get} setter={set} key={i}/>
      ))
    }
  </div>
)

const Statistic = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}


const Statistics = ({feedback}) => {
  const givenFeed = feedback.map(({get}) => get).some((get) => get > 0)
  const feeds_amount = feedback.map(({get}) => get).reduce((acc, val) => (acc + val))
  const score = feedback.map(({name, get}) => {
      if (name === "good") return get
      if (name === "bad") return -get
      else return 0
    }).reduce((acc, val) => (acc + val))
  const positive_feeds = feedback.map(({name, get}) => {
      if (name === "good") return get
      else return 0
    }).reduce((acc, val) => (acc + val))

  const positivity = positive_feeds / feeds_amount
  const average = score / feeds_amount
  
  return (
    <div>
      <h1>statistics</h1>
      {
        givenFeed ? (
          <>
            <table><tbody>
              {
                feedback.map(({name, get}, i) => (
                  <Statistic text={name} value={get} key={i}/>
                ))
              }
              <Statistic text="all" value={feeds_amount} />
              <Statistic text="average" value={average} />
              <Statistic text="positive" value={positivity + " %"} />
              </tbody></table>
          </>
        ) : (
          <p>No feedback given</p>
        )
      }
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const feedback = [
    Feedback("good", useState(0)),
    Feedback("neutral", useState(0)),
    Feedback("bad", useState(0)),
  ]

  return (
    <div>
      <Buttons feedback={feedback}/>
      <Statistics feedback={feedback}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)