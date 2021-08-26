import express from 'express'
import generateUploadURL from './s3.js'

const app = express()

app.use(express.static('react-app'))

app.get('/s3Url', async (req,res) => {
    const url = await generateUploadURL()
    res.send({url})
})

app.listen(3000, () => console.log("listening on port 3000"))