const express = require('express')
var bodyParser = require('body-parser');
const ipfsAPI = require('ipfs-api');
var cors = require('cors')
var fs = require('fs');
var path = require('path');
var str = require('string-to-stream')

const app = express()
const port = 3001

const https = require('https')


//const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' }) //EVENTUALLY WE WILL HAVE OUR OWN NODE SO THIS IS FASTER, BOOTSTRAPPING THRU INFURA FOR NOW

const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')

app.use(cors())

app.use(bodyParser.json({ limit: '4mb' }))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/save', function (req, res) {
    console.log("IPFS ADDING")
    //console.log("BUFFER:",req.body.buffer.size)
    ipfs.files.add(Buffer.from(req.body.buffer), function (err, file) {
        if (err) {
            console.log("ERROR:",err);
        }
        console.log(file)
        try{
          res.status(200).end(file[0].hash);
        }catch(e){
          console.log(e)
          res.status(500).end("Error",e);
        }

    })
});

//app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

https.createServer({
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('cert.pem'),
  ca: fs.readFileSync('fullchain.pem')
}, app).listen(3001, () => {
  console.log('Listening on 3001 SSL Style...')
})
