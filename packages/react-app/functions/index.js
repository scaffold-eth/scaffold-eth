const functions  = require('firebase-functions');
const admin      = require('firebase-admin');
const fs         = require('fs');

var app = admin.initializeApp();

// Getting and replacing meta tags
exports.preRender = functions.https.onRequest((request, response) => {

    const userAgent = request.headers['user-agent'].toLowerCase();

    // Error 404 is false by default
    let error404 = false;

    // Getting the path
    const path = request.path ? request.path.split('/') : request.path;

    // Getting index.html text
    let index = fs.readFileSync('./web/index.html').toString();

    // Changing metas function
    const setMetas = (imageLink) => {

        index = index.replace('https://ipfs.nifty.ink/unfurl.png', imageLink);
        index = index.replace('https://ipfs.nifty.ink/unfurl.png', imageLink);

    }

    const isBot = userAgent.includes('googlebot') ||
      userAgent.includes('yahoou') ||
      userAgent.includes('bingbot') ||
      userAgent.includes('baiduspider') ||
      userAgent.includes('yandex') ||
      userAgent.includes('yeti') ||
      userAgent.includes('yodaobot') ||
      userAgent.includes('gigabot') ||
      userAgent.includes('ia_archiver') ||
      userAgent.includes('facebookexternalhit') ||
      userAgent.includes('slackbot-linkexpanding') ||
      userAgent.includes('twitterbot') ||
      userAgent.includes('developers\.google\.com') ? true : false;

    console.log(userAgent, isBot, request.path, path)

    if(isBot) {
      try {

        const lastItem = path.length - 1

        const hashMatch = /^Qm[A-Za-z]+/;
        if (hashMatch.test(path[lastItem]))  {
          setMetas("https://ipfs.nifty.ink/" + path[lastItem])
        }
      } catch(e) {
        console.log(e.message)
      }

    }

    // We need to considerate the routes and a default state to 404 errors as well
    // ...


    // Sending index.html
    error404
    ? response.status(400).send(index)
    : response.status(200).send(index);

});
