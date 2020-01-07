# BlogScraper

This application has been created in order to collect all the images from the selected blogs of [blog.risingstack.com.](https://blog.risingstack.com/) Set the number of blog pages you want to crawl through using the number input field on UI. After you click the button the app will scrapes all the articles on the page and shows the images in the browser.

> ![](https://github.com/BalazsMikola/images-in-readme/blob/master/risingStack.gif)

### Technologies used: 
- React
- Node.js
- Mongodb/Mongoose

## Setup

### Install dependencies
All the dependencies listed in the package.json files. Install all of them at once using following command in the terminal:
<div class="highlight highlight-source-shell"><pre>npm install</pre></div>
or
<div class="highlight highlight-source-shell"><pre>yarn install</pre></div>
for both Frontend and Backend.

### Setup Mongo
- Create a new collection called "risingStack" in mongoDB Atlas (no need to create any database the app will do the job)
- Create a new user and password in "Database Access" menu in Atlas or use an exiting one
- Add your own mongo connection link to .env file (just overwrite the example link at MONGO_CONNECTION key)
- Add your IP adress to the whitelist in Atlas under the "Network Access" menu

### Start the app
- create an empty folder called "assets" inside the Backend folder for the downloaded images
- use the command "nodemon express.js" or "node express.js" in the terminal inside Backend folder
- start React in Frontend folder using the command "npm start"
