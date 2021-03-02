const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000

const connection = require('./database/database')

const Category = require('./categories/Category')
const Article = require('./articles/Article')
const User = require('./users/User')

const categoriesController = require('./categories/CatogoriesController')
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController");

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

app.use(session({
    secret: "qualquercoisa", cookie: { maxAge: 30000}
}))

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

app.get('/', (req, res) => {
    
    Article.findAll({   
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {

            res.render('index', {articles: articles, categories: categories})
        })

    })
})

app.get('/:slug', (req, res) => {

    let slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(articles => {

        if(articles !== undefined && articles !== null) {

            Category.findAll().then(categories => {
                res.render("article", {articles: articles, categories: categories})
            })
        
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})


app.get('/category/:slug', (req, res) => {

    let slug = req.params.slug

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]

    }).then(category => {

        if(category !== undefined) {

            Category.findAll().then(categories => {
                
                res.render('index', {categories: categories, articles: category.articles})
            })
        }
        else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

app.listen(PORT, () => {

    console.log(`Servidor rodando na porta: ${PORT}`)
})