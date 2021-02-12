const Sequelize = require("sequelize");

const connection = require('../database/database')
const Category = require("../categories/Category")

const Article = connection.define('articles', {

    title: {
        type: Sequelize.STRING,
        allowNull: false
    },

    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },

    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
    
})

Category.hasMany(Article) // Relacionamento: uma categoria tem vários artigos
Article.belongsTo(Category) // Relacionamento: um artigo percente a uma categoria


module.exports = Article;