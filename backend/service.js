'use strict'

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const Path = require('path')
const dataAccess = require('./dataAccess')

const createDomAndProcessHTML = (page, elementToProcess) => {
  return new JSDOM(page).window.document.querySelectorAll(elementToProcess)
}

const getImageFileNameFromItsPath = (imagePath) => {
  let reversedPath = imagePath.split('').reverse()
  return reversedPath.splice(0, reversedPath.indexOf('/')).reverse().join('')
}

const createResponse = (articlesFromDB, serverUrl) => {
  let response = { 
    data : [] 
  }
  for(let articleData of articlesFromDB){
    for(let img of articleData.imgs){
     let link = serverUrl + articleData.articleTitle + img
     response.data.push(link)
    }
  }
  return response
}

const createDownloadableLinkForImage = (image, baseURL) => {
  if(!image.includes('https://') && !image.includes('//www.')){
    image = baseURL + image
  }
  if(!image.includes('https://') && image.includes('//www.')){
    image = 'https:' + image + '.jpeg'
  }
  return image
}

const downloadImages = async (articlesAndImages, baseURL) => {

  let dataForDB = []
  let error

  for (let i=0; i<articlesAndImages.length; i++ ){

    let successfullyDownloadedImages = []

    if(!fs.existsSync(`assets${articlesAndImages[i].articleTitle}`)){
      fs.mkdirSync(`assets${articlesAndImages[i].articleTitle}`)
    }
      
    for (let image of articlesAndImages[i].imgs){
        
      let filename = getImageFileNameFromItsPath(image)
      let url = createDownloadableLinkForImage(image, baseURL)
 
      const path = Path.resolve(__dirname, `assets${articlesAndImages[i].articleTitle}`, filename)
      const fileWriter = fs.createWriteStream(path)
      fileWriter.on('error', (err) => {
        console.log("ERROR:" + err)
        fileWriter.end()
      })
      const options = { url, method: 'GET', responseType: 'stream' }
      const [response, error] = await dataAccess.makeAPICall(options)
      
      if(!error){
        response.data.pipe(fileWriter)
        .on('close', () => {
          successfullyDownloadedImages.push(filename)
        })
        .on('error', (error) => {
          console.log(`Cant write file: ${filename} ${error}` )
        })
      }
    }
    dataForDB[i] = {
      articleTitle: articlesAndImages[i].articleTitle,
      imgs: successfullyDownloadedImages
    }
  }
  return [dataForDB, error]
}

const collectImagesFromNewArticles = async (articles,baseURL) => {
  let articlesAndImages = []
  let options = {}
  let url = ''
  let error

  for (let i=0; i<articles.length; i++){
    url = baseURL + articles[i]
    options = { url , method: 'GET'}
    const [response, error] = await dataAccess.makeAPICall(options)

    if(!error){
      const imagesInHtmlElements = createDomAndProcessHTML(response.data,'img')
      articlesAndImages[i] = {
        articleTitle: articles[i],
        imgs: []
      }
      for (let image of imagesInHtmlElements){
        articlesAndImages[i]['imgs'].push(image.src)
      }
    }
  }
  return [articlesAndImages,error]
}

const visitPagesAndGetArticleLinks = async (url) => {
  let listOfPaths = []
  const options = { url, method: 'GET' }
  const [response, error] = await dataAccess.makeAPICall(options)
  if(!error){
    let articlePaths = createDomAndProcessHTML(response.data,'.post-title > a')
    for (let path of articlePaths){
      listOfPaths.push(path.href)
    }
  }
  return [listOfPaths,error]
}

module.exports.visitPagesAndGetArticleLinks = visitPagesAndGetArticleLinks
module.exports.collectImagesFromNewArticles = collectImagesFromNewArticles
module.exports.downloadImages = downloadImages
module.exports.createResponse = createResponse