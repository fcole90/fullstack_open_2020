import React from "react"

const Person = ({name, number, deleteOnClick}) => (
  <>
    <p>{name} {number}</p>
    <button onClick={deleteOnClick}>Delete</button>
  </>
    
)

const Persons = ({persons, searchName, deleteFunction}) => (

  persons.filter(({name}) => (
    name.toLowerCase().startsWith(searchName.toLowerCase())
  ))
  .map(({name, number, id}) => (
    <Person key={id} name={name} number={number} 
    deleteOnClick={(event) => {
      event.preventDefault()
      deleteFunction(id)
    }}
    />
  ))
)

export default Persons