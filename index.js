const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000

const connection = require('./database/database')

const Category = require('./categories/Category')
const Article = require('./articles/Article')

const categoriesController = require('./categories/CatogoriesController')
const articlesController = require("./articles/ArticlesController")

// View Engine
app.set('view engine', 'ejs')

// Bodyparser Configs
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Database connection
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso")
    })
    .catch(e => {
        console.log(e)
    })


// Serving static files
app.use(express.static('public'))



app.use('/', categoriesController)
app.use('/', articlesController)

app.get('/', (req, res) => {
    res.render('index')
})


app.listen(PORT, () => {

    console.log(`Servidor rodando na porta: ${PORT}`)
})