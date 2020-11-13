import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const argmax = (x) => (
  x.reduce((best, current, currentIndex) => 
  (
    current > best[0]) ? [current, currentIndex] : best,
    [x[0], 0]
  )[1]
)


const VoteButton = ({votes, setVotes, selected, anecdotes}) => {
  const handler = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  return (
    <button onClick={handler}>vote</button>
  )
}


const RandomButton = ({anecdotes, setSelected}) => {
  const handler = () => {
    const randomValue = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomValue)
  }

  return (
    <button onClick={handler}>next anecdote</button>
  )
}


const Andecdote = ({title, anecdote, vote}) => (
  <>
    <h1>{title}</h1>
    <p>{anecdote}</p>
    <p>Has {vote} votes.</p>
  </>
)


const App = ({anecdotes}) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(anecdotes.map(() => 0))
  const mostVoted = argmax(votes)

  return (
    <div>
      <Andecdote title="Anecdote of the day" anecdote={anecdotes[selected]} vote={votes[selected]} />
      <div>
        <VoteButton votes={votes} setVotes={setVotes} anecdotes={anecdotes} selected={selected} />
        <RandomButton anecdotes={anecdotes} setSelected={setSelected} />
      </div>
      <Andecdote title="Anecdote with most votes" anecdote={anecdotes[mostVoted]} vote={votes[mostVoted]} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)