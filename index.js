const express = require('express')
const app = express()
const morgan = require('morgan')

// ADD CORS
const cors = require('cors')

app.use(cors())

// MIDDLEWARE , permite usar dist
app.use(express.static('dist'))


app.use(express.json())
// app.use(morgan('tiny'))

// Defining a custom token for morgan
morgan.token('req-body', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return "";
})

// Defining to use morgan with tiny conf custom adding req.body
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"))

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

// ** APP.GET **
// ALL:
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// 1 ENTRY:
app.get('/api/persons/:id' , (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find((person) => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.statusMessage = 'There is no person'
        res.status(404).end()
    }
})

// INFO
app.get('/info', (req,res) => {
    const date = new Date()
    const entries = people.length

    res.send(`
        <p>Phonebook has info for ${entries} ${entries === 1 ? 'people' : 'person'}</p>
        <p>${date}</p>
        `)
})

// ** APP.POST **
const generateId = () => {
    return Math.floor(Math.random()*100000)
}

const comprobateName = (name) => {
    const names = persons.map( n => n.name.toLowerCase())
    return names.includes(name.toLowerCase())
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(req.body)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name and number needed'
        })
    } 

    if (comprobateName(body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    res.json(person)
})

// ** APP.DELETE **
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter((person) => person.id !== id )

    res.status(204).end()
})

// PORT
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})