const express = require('express')

const app = express()

app.use(express.json())


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// route to get all persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// route to obtain infromation about number of persons and time of this request
app.get('/info', (request, response) => {
    const numOfEntry = persons.length
    const timeOfRequest = new Date()
    const message = `<p>Phonebook has info for ${numOfEntry} people<br/> ${timeOfRequest} </p>`
    response.send(message)
})

// route to obtain a specific person's data
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(!person){
        response.statusMessage = 'Requested resource not found'
        response.status(404).send()
    }else{
        response.json(person)
    }
})

// route to respond to HTTP DELETE request type
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).send()

})

// Function to obtain a randomly generated id for new person's object
const genrateId = () => {
    const maximumRange = persons.length * 100;
    const id = Math.floor(Math.random() * maximumRange)
    return id
}
// route to handle HTTP POST request type
app.post('/api/persons', (request, response) => {
    const body = request.body

    const newPersonObject = {
        "id": genrateId(),
        "name": body.name,
        "number": body.number
    }

    persons = persons.concat(newPersonObject)
    response.json(newPersonObject)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log('server is running on port ', PORT)
})