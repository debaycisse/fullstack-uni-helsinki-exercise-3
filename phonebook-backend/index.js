const express = require('express')
const morgan = require('morgan')

// Customized token format to return request data for HTTP POST request.
morgan.token('body', function(request, response) {
    return JSON.stringify(request.body)
})


const app = express()



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
    },
    {
        "id": 23,
        "name": "Azeez Adebayo",
        "number": "234-817-977-6939"
    }
]

app.use(express.json())

app.use(express.static('build'))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))  // (pre-defined -> tiny, combined, common, dev, short), (cutomized -> body)


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

    const duplicateName = persons.find(person => person.name === body.name)
    
    if(!body.name || !body.number){
        const message = {
            "error": "either name or number is missing"
        }
        response.json(message)
    }else if(duplicateName){
        const message = {
            "error": "name must be unique"
        }
        response.json(message)
    }else{
        const newPersonObject = {
            "id": genrateId(),
            "name": body.name,
            "number": body.number
        }
    
        persons = persons.concat(newPersonObject)
        response.json(newPersonObject)
    }
})


const PORT = 3001


app.listen(PORT, () => {
    console.log('server is running on port ', PORT)
})