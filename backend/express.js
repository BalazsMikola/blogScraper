'use strict'

const service = require('./service')
const dataAccess = require('./dataAccess')

const dotenv = require('dotenv')
dotenv.config()

const env = {
  PORT: process.env.PORT,
  baseURL: process.env.BASE_URL,
  connectionString: process.env.MONGO_CONNECTION
}

const express = require('express')
const app = express()

app.use('/public', express.static('assets')) 

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/', async (req, res) => {

  const pageNumber = req.query.page;
  const serverUrlToPublicFolder = req.protocol + '://' + req.get('host') + '/public'
  
  let [listOfArticleLinks, visitPageError] = await service.visitPagesAndGetArticleLinks(env.baseURL)
  if(visitPageError) throw new Error('Could not fetch webpage!' + visitPageError)
  
  if(pageNumber !== '1'){
    for (let i=2; i<parseInt(pageNumber)+1; i++){
      const [response, visitPageError]= await service.visitPagesAndGetArticleLinks(`${env.baseURL}/page/${i}`)
      if(visitPageError) throw new Error('Could not fetch webpage!' + visitPageError)
      listOfArticleLinks = listOfArticleLinks.concat(response)
    }
  }

  const [newArticles, dataBaseError] = await dataAccess.checkDBForUnprocessedArticles(listOfArticleLinks)
  if(dataBaseError) throw new Error('Database Error!' + dataBaseError)

  const [articlesAndImages, collectImagesError]= await service.collectImagesFromNewArticles(newArticles,env.baseURL)
  if(collectImagesError) throw new Error('Could not get images!' + collectImagesError)

  const [dataForDB, downloadError] = await service.downloadImages(articlesAndImages,env.baseURL)
  if(downloadError) throw new Error('Could not dowload!' + downloadError)

  const [isSaved, dataBaseError2] = await dataAccess.saveNewArticleTitleAndImagesToDB(dataForDB)
  if(!isSaved && dataBaseError2){
    throw new Error('Save failed!' + dataBaseError2)
  }else console.log('Data saved successfully')

  const [articlesFromDB, dataBaseError3] = await dataAccess.getRequiestedDataFromDB(listOfArticleLinks)
  if(dataBaseError3) throw new Error('Could get data from Database!' + dataBaseError3)

  const response = service.createResponse(articlesFromDB, serverUrlToPublicFolder)
  
  res.json(response)
})

const startServer = async () => {
  app.listen(process.env.PORT, (error) => {
    if(error) {
      console.log(error)
      return
    }else{
      console.log(`Server is up and listening on port ${process.env.PORT}!`)
    }
  })
}
startServer()