import React from "react"

const PersonForm = ({addPerson, newName, updateName, newNum, updateNum}) => (
    <form onSubmit={addPerson}>
        <div>
          name: <input onChange={updateName} value={newName}/>
          <div>number: <input onChange={updateNum} value={newNum}/></div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
)

export default PersonForm