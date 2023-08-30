require('dotenv').config()
const env = process.env
const express = require('express')
const cors = require('cors')

const {
    sequelize
} = require('./app/models');

const PORT = env.LISTEN_PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get('/', (req, res, next) => {
    res.json({
        message: 'Welcome to the API'
    })
})

require('./app/router/router.api')(app)

try {
    app.listen(PORT, () => console.log(`Server listen on http://localhost:${PORT}`))
} catch (error) {
    console.error('Unable to start server:', error);
}

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}