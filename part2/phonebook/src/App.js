import React, { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PersonService from "./services/persons"

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.type}>
      {message.content}
    </div>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])
 
  useEffect(() => {
    PersonService
      .getAll()
      .then(response => (
        setPersons(response.data)
      ))
  }
  , [])

  const [ newName, setNewName ] = useState('')
  const [ searchName, setSearchName ] = useState('')
  const [ newNum, setNewNum ] = useState('')
  const [notification, setNotification] = useState(null)

  const notify = (message, type = "notification") => {
    setNotification({
      content: message,
      type: type
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const updateName = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  }

  const updateNum = (event) => {
    console.log(event.target.value);
    setNewNum(event.target.value);
  }

  const updateSearchName = (event) => {
    console.log(event.target.value);
    setSearchName(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (newName.length > 0) {
      if (!persons.some((person) => (person.name === newName))) {
        console.log("Adding", newName, "..")
        const newPerson = {
          name: newName,
          number: newNum
        }
      
        PersonService
          .create(newPerson)
          .then(response => {
            console.log(`${newName} was added to server data`)
            setPersons(persons.concat(response.data))
            setNewName("")
            setNewNum("")
            notify(`Added ${response.data.name}`)
          })
          .catch(err => {
              console.log("Error!", err)
          })
      }
      else {
        if (window.confirm(`${newName} is already added to phonebook. Replace the old number with the new one?`)) {
          console.log("Confirmed");
          const personToUpdate = persons.find((person) => person.name === newName)
          const updateId = personToUpdate.id
          const updatedPerson = {
            ...personToUpdate,
            number: newNum
          }

          PersonService.update(updateId, updatedPerson)
          .then((response) => {
            console.log("Updated!", response)
            setPersons(persons.map((person) => (person.id === updateId ? response.data : person)))
            notify(`Updated ${response.data.name}`)
          })
          .catch((err) => {
            if (err.response.status === 404) {
              notify(`Information on ${newName} has already been removed from server`, "error")
              setPersons(persons.filter(person => person.id !== updateId))
            }
            else {
              console.log("Error!", err)
            }
          })
        }
        else {
          console.log("Not updating!");
        }
      }
    }
    console.log(persons)
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    PersonService.delete(person.id)
    .then((response) => {
      console.log(`Deleted "${person.name}"`, response)
      setPersons(persons.filter(p => p.id !== id))
    })
    .catch((err) => {
      console.log(`Error deleting "${person.name}"`, err)
    })
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter onChange={updateSearchName} value={searchName} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} 
        newName={newName} updateName={updateName} 
        newNum={newNum} updateNum={updateNum}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} searchName={searchName} deleteFunction={deletePerson} />
    </div>
  )
}

export default App