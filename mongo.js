const mongoose = require('mongoose')

// if there are only 1 or 2 arguments you would need a passwordnp
if(process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const db_password = process.argv[2] // argv number 3 = password
const db_username = 'jemb'

const url =
    `mongodb+srv://${db_username}:${db_password}@phonebook.xtfkc.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Phonebook`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

/* FIND ALL PEOPLE */
// if you give only 3 argv, program will show you all the saved schemes
if(process.argv.length === 3) {

  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })

} else {

  /* ADD A NEW PERSON */
  const personName = process.argv[3]
  const personNumber = process.argv[4]

  const person = new Person ({
    name: personName,
    number: personNumber,
  })

  person.save().then( () => {
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  })
}