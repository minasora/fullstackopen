
 data = [
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
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 3001
const morgan = require('morgan')
app.use(express.json())
app.use(cors())
 app.use(express.static('build'))
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))
app.get('/api/persons', (req, res) => {
    res.json(data)
})
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${data.length} people</p>
    <p>${new Date()}</p>`)
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = data.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    if (data.find(person => person.id === id)) {
        data = data.filter(person => person.id !== id)
        res.status(204).end()
    }
    else {
        res.status(404).end()
    }
})
 app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }
    if (data.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000)
    }
    data = data.concat(person)
    res.json(person)
 }
 )
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})