require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

// Customized token format to return request data for HTTP POST request.
morgan.token('body', function(request, response) {
    return JSON.stringify(request.body)
})

// Express instance
const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))  // (pre-defined -> tiny, combined, common, dev, short), (cutomized -> body)


// route to handle HTTP GET request type for all persons
app.get('/api/persons', (request, response, next) => {
    Person
        .find({})
        .then(returnedPersonObjects => {
        response.json(returnedPersonObjects)
        })
        .catch(error => next(error))
})


// route to obtain infromation about number of persons and time of this request
app.get('/info', (request, response, next) => {
    Person
        .find({})
        .then(returnedObjects => {
            const numOfEntry = returnedObjects.length
            const timeOfRequest = new Date()
            const message = `<p>Phonebook has info for ${numOfEntry} people<br/> ${timeOfRequest} </p>`
            response.send(message)
        })
        .catch(error => next(error))
})


// route to handle HTTP GET request type for getting a specific person
app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person
        .find({_id:id})
        .then(returnedPerson => {
            if(returnedPerson.length < 1){
                response.statusMessage = 'Requested resource not found'
                response.status(404).send()
            }else{
                response.json(returnedPerson)
            }
        })
        .catch(error => next(error))
})


// route to handle HTTP DELETE request type
app.delete('/api/persons/:id', (request, response, next) => {
    
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

})


// Function to obtain a randomly generated id for new person's object
// const genrateId = () => {
//     const maximumRange = persons.length * 100;
//     const id = Math.floor(Math.random() * maximumRange)
//     return id
// }


// route to handle HTTP POST request type
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number){
        const message = {
            "error": "either name or number is missing"
        }
        response.status(400).json(message)

    }else {

        const person = new Person(
            {
                "name": body.name,
                "number": body.number
            }
        )
        person.save()
        .then(storedPerson => {
                response.json(storedPerson)
            })
        .catch(error => next(error))
        
    }

})


// route to handle HTTP PUT request type
app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    const body = request.body;

    if(!body.name || !body.number){
        const message = {
            "error": "either name or number is missing"
        }
        response.status(400).json(message)

    }else {
        
        const updatedPerson = {
            name: body.name,
            number: body.number
        }

        Person
            .findByIdAndUpdate(id, updatedPerson, {new: true})
            .then(returnedUpdatedPerson => {
                response.json(returnedUpdatedPerson);
            })
            .catch( error => next(error))
    }

})

const errorHandler = (error, request, response, next) => {
    console.log(`Error Message : ${error.message}`)

    if (error.name === "CastError") {
        return response.status(400).send({error: 'Malformed ID, wrong ID value.'})
    }

    next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('server is running on port ', PORT)
})