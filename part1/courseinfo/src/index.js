import React from 'react'
import ReactDOM from 'react-dom'

const Header = ({course}) => (
  <>
    <h1>{course}</h1>
  </>
)

const Part = ({part, exercise}) => (
  <>
    <p>
        {part} {exercise}
    </p>
  </>
)

const Content = ({parts}) => (
  <>
    {parts.map(({name, exercises}, i) => (
      <Part key={`part_${i}`} part={name} exercise={exercises} />
    ))}
  </>
)

const Total = ({parts}) => {
  const num_exercises = parts.map(part => part.exercises)
    .reduce((acc, val) => (acc + val))

  return (
    <>
      <p>Number of exercises {num_exercises}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total  parts={course.parts} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))