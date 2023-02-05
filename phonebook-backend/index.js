require('dotenv').config()


const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

// Customized token format to return request data for HTTP POST request.
morgan.token('body', function(request, response) {
    return JSON.stringify(request.body)
})


const app = express()



// let persons = [
//     { 
//         "id": 1,
//         "name": "Arto Hellas", 
//         "number": "040-123456"
//     },
//     { 
//         "id": 2,
//         "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//         "id": 3,
//         "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     },
//     {
//         "id": 23,
//         "name": "Azeez Adebayo",
//         "number": "234-817-977-6939"
//     }
// ]

app.use(express.json())

app.use(express.static('build'))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))  // (pre-defined -> tiny, combined, common, dev, short), (cutomized -> body)


// route to handle HTTP GET request type for all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(returnedPersonObjects => {
        response.json(returnedPersonObjects)
    })
})


// route to obtain infromation about number of persons and time of this request
app.get('/info', (request, response) => {
    Person.find({}).then(returnedObjects => {
        const numOfEntry = returnedObjects.length
        const timeOfRequest = new Date()
        const message = `<p>Phonebook has info for ${numOfEntry} people<br/> ${timeOfRequest} </p>`
        response.send(message)
     })
})


// route to handle HTTP GET request type for getting a specific person
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.find({_id:id}).then(returnedPerson => {
        if(returnedPerson.length < 1){
            response.statusMessage = 'Requested resource not found'
            response.status(404).send()
        }else{
            response.json(returnedPerson)
        }
    })

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
const genrateId = () => {
    const maximumRange = persons.length * 100;
    const id = Math.floor(Math.random() * maximumRange)
    return id
}


// route to handle HTTP POST request type
app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number){
        const message = {
            "error": "either name or number is missing"
        }
        response.json(message)

    }else {

        Person.find({name:body.name}).then(result => {

            // Handle dubplicate entry
            if(result.length > 0){
                // entry must be modified but not new record be created
                const person = {
                    name: body.name,
                    number: body.number
                }
                const id = result[0].id
                Person.findByIdAndUpdate(id, person, {new: true})
                    .then(updatedPerson => {
                        response.json(updatedPerson)
                    })
                    .catch(error => response.json({"Error Message": error.message}))
            }
            else{
                const newPersonObject = {
                    "name": body.name,
                    "number": body.number
                }
    
                const person = new Person(newPersonObject)
                person.save()
                    .then(storedPerson => {
                        response.json(storedPerson)
                    })
            }
    
        })
        
    }

    
})


const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log('server is running on port ', PORT)
})