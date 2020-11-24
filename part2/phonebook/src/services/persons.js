import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl)
  }
  
const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const _delete = (id, newObject) => {
  return axios.delete(`${baseUrl}/${id}`, newObject)
}
  

const personService = { 
  getAll, 
  create, 
  update,
  delete: _delete
}

export default personService