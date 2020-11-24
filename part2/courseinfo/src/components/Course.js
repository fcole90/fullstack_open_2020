import React from "react"

const Header = ({course}) => (
    <h1>{course}</h1>
  )
  
  const Part = ({part, exercise}) => (
    <p>
        {part} {exercise}
    </p>
  )
  
  const Content = ({parts}) => (
    <>
      {parts.map(({name, exercises, id}) => (
        <Part key={id} part={name} exercise={exercises} />
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
  
  const Course = ({course}) => (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total  parts={course.parts} />
    </div>
  )

  export default Course