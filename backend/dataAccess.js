'use strict'

const axios = require('axios')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const env = {
  PORT: process.env.PORT,
  baseURL: process.env.BASE_URL,
  connectionString: process.env.MONGO_CONNECTION
}

const blogSchema = mongoose.Schema({
  articleTitle: String,
  imgs: Array
})

const Blog = mongoose.model('Blog', blogSchema, 'blogData')

const optionsForMongooseConnect = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect(env.connectionString, optionsForMongooseConnect)
.then(() => console.log('Connection established to DB'))
.catch((err) => {
  throw new Error('Database connection failed!' + err)
})

const getRequiestedDataFromDB = async (wantedArticles) => {

  return Blog.find({
    'articleTitle': { $in: wantedArticles}
  })
  .then((response) => ([response,undefined]))
  .catch((error) => Promise.resolve([undefined, error]))
}

const saveNewArticleTitleAndImagesToDB = async (dataToSave) => {

  return Blog.insertMany(dataToSave)
  .then(() => ([true, undefined]))
  .catch((error) => Promise.resolve([undefined, error]))
}

const checkDBForUnprocessedArticles = async (listOfArticleLinks) => {

  return Blog.find({
    'articleTitle': { $in: listOfArticleLinks}
  })
  .then((response) => {
    let newArticles = listOfArticleLinks.filter(currentLink => !response.some(article => article.articleTitle.toString() === currentLink))
    return ([newArticles, undefined])
  })
  .catch((error) => Promise.resolve([undefined, error]))
}

const makeAPICall = async (options) => {
  return await axios(options)
  .then(response => ([response,undefined]))
  .catch(error => Promise.resolve([undefined, error]))
}

module.exports.makeAPICall = makeAPICall
module.exports.checkDBForUnprocessedArticles = checkDBForUnprocessedArticles
module.exports.saveNewArticleTitleAndImagesToDB = saveNewArticleTitleAndImagesToDB
module.exports.getRequiestedDataFromDB = getRequiestedDataFromDB