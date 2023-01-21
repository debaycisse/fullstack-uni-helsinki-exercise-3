const express = require('express')

const app = express()


const persons = [
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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const numOfEntry = persons.length
    const timeOfRequest = new Date()
    const message = `<p>Phonebook has info for ${numOfEntry} people<br/> ${timeOfRequest} </p>`
    response.send(message)
})

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

const PORT = 3001

app.listen(PORT, () => {
    console.log('server is running on port ', PORT)
})