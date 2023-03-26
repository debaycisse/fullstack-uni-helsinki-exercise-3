const mongoose = require('mongoose')

/***************************************************************** 
 * Setup for mongoose
******************************************************************/
mongoose.set('strictQuery', false)
const mongoDbUri = process.env.MONGODB_URL

console.log("Connecting to MongoDB...")

mongoose.connect(mongoDbUri).then(result => {
    console.log("Connected to MongoDB.")
}).catch(error => {
    console.log(`Error while connecting to MongoDB - ${error.message}`)
})


const personSchema = mongoose.Schema(
    {
        name: {
            type: String,
            minLength: 3,
            required: true,
        },
        number: {
            type: String,
            validate: {
                validator : function(value) {
                    return /\d{2}-\d{8}/.test(value) || /\d{3}-\d{8}/.test(value);  // regex to match number in format DD-DDDDDDDD or DDD-DDDDDDDD
                },
                message: props => `${props.value} is not a valid phone number. Phone number must in format DDD-DDDDDDDD or DD-DDDDDDDD`
            },
            required: [true, 'User\'s phone number required.']
        }
    }
)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


/***************************************************************** 
 * Exportation of this module so that external module can use it
******************************************************************/

module.exports = mongoose.model('Person', personSchema)




/***************************************************************** 
 * Logic to direct the execution chain of the application to the 
 * appropriate channel
******************************************************************/
// if (process.argv.length < 5) {
//     // Fetch the data from the DB since name and number are NOT provided
//     Person
//         .find({})
//         .then(people => {
//             console.log(`Phonebook:`);
//             people.forEach(personObj => {
//                 console.log(`${personObj.name} ${personObj.number}`)
//             })
//             mongoose.connection.close()
//         })
// }
// else if (process.argv.length === 5) {
//     // Post the data in to the DB since name and number are provided
//     const person = new Person(
//         {
//             name: personName,
//             number: personNumber
//         }
//     )

//     person
//         .save()
//         .then(storedPersonObj => {
//             console.log(`Added ${storedPersonObj.name} number ${storedPersonObj.number} to phonebook`)
//             mongoose.connection.close()
//         })

// }
// else {
//     console.log(`Correct your input and try again.`)
//     process.exit(1)
// }
