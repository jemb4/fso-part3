require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const morgan = require('morgan')

// ADD CORS
const cors = require('cors')

app.use(cors())

// MIDDLEWARE , allow to us dist
app.use(express.static('dist'))


app.use(express.json())

// Defining a custom token for morgan
morgan.token('req-body', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return "";
})

// Defining to use morgan middleware with tiny conf custom adding req.body
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"))


let persons = []

// ** APP.GET **
// ALL:
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// 1 ENTRY:
app.get('/api/persons/:id' , (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(err => next(err))
})

// INFO
app.get('/info', (request, response, next) => {
    const date = new Date()
    Person.find({})
        .then(person => {
            response.send(`
                <p>Phonebook has info for ${person.length} ${person.length === 1 ? 'people' : 'person'}</p>
                <p>${date}</p>
                `)
        })
        .catch(err => next(err))
})

// ** APP.POST **

// NOT USED SINCE MOONGOSE IS USED
// const generateId = () => {
//     return Math.floor(Math.random()*100000)
// } 
// NOT USED SINCE MOONGOSE IS USED

const comprobateName = (name) => {
    const names = persons.map( n => n.name.toLowerCase())
    return names.includes(name.toLowerCase())
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    // if (!body.name || !body.number) {
    //     return response.status(400).json({
    //         error: 'name and number needed'
    //     })
    // } 

    // if (comprobateName(body.name)){
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

// ** APP.DELETE **
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(err => next(err))
})

// ** APP.PUT **

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(err => next(err))
})

// Middleware who can help if you look for a non exist route
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  // error handdling Middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError' || error.number === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
  
    next(error)
  }

  app.use(errorHandler)

// PORT
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})