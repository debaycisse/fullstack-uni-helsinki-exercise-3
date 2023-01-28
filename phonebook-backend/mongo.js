const mongoose = require('mongoose')

// Logic to check if the password argument is supplied in the terminal
if (process.argv.length < 3) {
    console.log(`Try again and give your password as argument`);
    process.exit(1);
}


/***************************************************************** 
 * Setup to grab the password, name, and number from the terminal.
 * And database's uri is also setup. The name of the App is named
 * phonebookApp as stated in the DB's uri
******************************************************************/
const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]
const mongoDbUri = `mongodb+srv://fullstack:${password}@cluster0.qsnhtah.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(mongoDbUri)

const personSchema = mongoose.Schema(
    {
        name: String,
        number: String
    }
)

const Person = mongoose.model('Person', personSchema)


/***************************************************************** 
 * Logic to direct the execution chain of the application to the 
 * appropriate channel
******************************************************************/
if (process.argv.length < 5) {
    // Fetch the data from the DB since name and number are NOT provided
    Person
        .find({})
        .then(people => {
            console.log(`Phonebook:`);
            people.forEach(personObj => {
                console.log(`${personObj.name} ${personObj.number}`)
            })
            mongoose.connection.close()
        })
}
else if (process.argv.length === 5) {
    // Post the data in to the DB since name and number are provided
    const person = new Person(
        {
            name: personName,
            number: personNumber
        }
    )

    person
        .save()
        .then(storedPersonObj => {
            console.log(`Added ${storedPersonObj.name} number ${storedPersonObj.number} to phonebook`)
            mongoose.connection.close()
        })

}
else {
    console.log(`Correct your input and try again.`)
    process.exit(1)
}
